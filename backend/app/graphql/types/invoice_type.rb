# frozen_string_literal: true

class Types::InvoiceType < Types::BaseObject
  field :id, ID, null: false
  field :invoice_type, Types::Invoice::InvoiceTypeEnum, null: false
  field :number, Integer, null: false
  field :primary, Boolean, null: false
  field :total, Float, null: false

  field :booking, Types::BookingType, scope: "BookingPolicy", preload: :booking, null: false
  field :invoice_items, [Types::InvoiceItemType], scope: "InvoiceItemPolicy", preload: :invoice_items, null: false
  field :invoice_service_charges, [Types::InvoiceServiceChargeType], scope: "InvoiceServiceChargePolicy", preload: :invoice_service_charges, null: false # rubocop:disable Layout/LineLength
  field :payments, [Types::PaymentType], scope: "PaymentPolicy", preload: :payments, null: false

  field :paid_amount, Float, preload: :payments, null: false
  field :status, Types::Invoice::StatusEnum, preload: :payments, null: false
  field :sub_total, Float, null: false
  field :tax_summary, [Types::TaxSummaryType], preload: [:invoice_items, :invoice_service_charges], null: false
  field :total_discount, Float, null: false

  def paid_amount
    object.payments.reject { |i| i.payment_mode == "void" }.sum(&:amount)
  end

  def status
    paid_amount = object.payments.reject { |i| i.payment_mode == "void" }.sum(&:amount)
    void_payment = object.payments.any? { |i| i.payment_mode == "void" }

    return "voided" if void_payment
    return "paid" if paid_amount == object.total
    return "overpaid" if paid_amount > object.total

    "unpaid"
  end

  def sub_total # rubocop:disable Metrics/AbcSize
    BatchLoader::GraphQL.for(object.id).batch do |ids, loader|
      invoice_items = InvoiceItem.arel_table

      sub_total = InvoicePolicy.new(context[:current_session]).scope.where(id: ids)
                               .joins(:invoice_items)
                               .group(:id).sum(invoice_items[:price])

      ids.each { |i| loader.call(i, sub_total[i] || 0) }
    end
  end

  def tax_summary # rubocop:disable Metrics/AbcSize, Metrics/PerceivedComplexity, GraphQL/ResolverMethodLength, Metrics/CyclomaticComplexity
    taxes = []

    invoice_items_table = InvoiceItem.arel_table
    ticket_items_table = TicketItem.arel_table
    invoice_item_summaries_table = InvoiceItemSummary.arel_table

    invoice_items_query = invoice_items_table
                          .join(ticket_items_table)
                          .on(invoice_items_table[:ticket_item_id].eq(ticket_items_table[:id]))
                          .join(invoice_item_summaries_table)
                          .on(invoice_items_table[:id].eq(invoice_item_summaries_table[:invoice_item_id]))
                          .project(
                            invoice_items_table[Arel.star],
                            ticket_items_table[:hst],
                            ticket_items_table[:gst],
                            ticket_items_table[:pst],
                            ticket_items_table[:rst],
                            ticket_items_table[:qst],
                            ticket_items_table[:cst],
                            invoice_item_summaries_table[:discounted_amount]
                          )
                          .where(invoice_items_table[:invoice_id].eq(object.id))

    invoice_items = InvoiceItem.find_by_sql(invoice_items_query.to_sql)

    calculate_and_add_tax = lambda do |name, value|
      tax = taxes.find { |t| t[:name] == name }
      if tax
        tax[:value] += value
      else
        taxes << { name: name, value: value }
      end
    end

    invoice_items.each do |i|
      discounted_amount = i.discounted_amount

      [:hst, :gst, :pst, :rst, :qst, :cst].each do |tax_type|
        tax_rate = i.public_send(tax_type)
        next if tax_rate.zero?

        tax_value = discounted_amount * (tax_rate / 100.0)
        tax_name = "#{tax_type.to_s.upcase} #{tax_rate.round(0)}%"
        calculate_and_add_tax.call(tax_name, tax_value)
      end
    end

    inv_total = invoice_items.sum(&:discounted_amount)
    inv_count = object.booking.invoices.count

    object.invoice_service_charges.each do |i|
      value = i.charge_type == "percentage" ? inv_total * (i.value / 100.0) : (i.value / inv_count)

      [:hst, :gst, :pst, :rst, :qst, :cst].each do |tax_type|
        tax_rate = i.public_send(tax_type)
        next if tax_rate.zero?

        tax_value = value * (tax_rate / 100.0)
        tax_name = "#{tax_type.to_s.upcase} #{tax_rate.round(0)}%"
        calculate_and_add_tax.call(tax_name, tax_value)
      end
    end

    taxes
  end

  def total_discount # rubocop:disable Metrics/AbcSize
    BatchLoader::GraphQL.for(object.id).batch do |ids, loader|
      invoice_items = InvoiceItem.arel_table
      invoice_item_summaries = InvoiceItemSummary.arel_table

      amount = InvoicePolicy.new(context[:current_session]).scope.where(id: ids)
                            .joins(invoice_items: :invoice_item_summary)
                            .group(:id).sum(invoice_items[:price] - invoice_item_summaries[:discounted_amount])

      ids.each { |i| loader.call(i, amount[i] || 0) }
    end
  end
end
