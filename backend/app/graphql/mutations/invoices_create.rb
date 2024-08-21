# frozen_string_literal: true

class Mutations::InvoicesCreate < Mutations::BaseMutation
  argument :attributes, [Types::InvoiceAttributes], required: true
  argument :booking_id, ID, required: true

  type Boolean, null: false

  def resolve(attributes:, booking_id:) # rubocop:disable Metrics/AbcSize, Metrics/CyclomaticComplexity, Metrics/PerceivedComplexity
    booking = BookingPolicy.new(context[:current_user]).scope.find(booking_id)
    invoices = InvoicePolicy.new(context[:current_user]).scope.where(booking_id: booking_id)

    sub_total = 0

    ApplicationRecord.transaction do
      if invoices.present?
        if invoices.exists?(status: "paid")
          raise_error "You can't generate invoices for this booking because it already has a paid invoice"
        else
          invoices.destroy_all
        end
      end

      attributes.each do |invoice_attributes|
        total = 0

        invoice = Invoice.new(
          booking: booking,
          invoice_type: invoice_attributes[:invoice_type]
        )

        invoice_attributes[:invoice_items].each do |item_attributes|
          ticket_item = TicketItemPolicy.new(context[:current_user]).scope.find(item_attributes[:ticket_item_id])
          discounted_price = 0
          item_discount = 0
          new_price = 0
          addon_price = ticket_item.ticket_item_addons.sum(:price)

          price = ticket_item.price + addon_price
          consume_bill = item_attributes[:consume_bill]
          qty = ticket_item.quantity

          discount_type = ticket_item.applied_discount.discount_type if ticket_item.applied_discount.present?
          discount = ticket_item.applied_discount.value if ticket_item.applied_discount.present?

          if discount_type == "percentage"
            new_price = price * (qty / consume_bill)
            discounted_price = new_price - (new_price * discount / 100)
            item_discount = new_price - discounted_price
          elsif discount_type == "flat"
            new_price = price * (qty / consume_bill)
            ration = new_price / price
            item_discount = ration * discount
            discounted_price = new_price - item_discount
          else
            item_discount = 0
            new_price = price * (qty / consume_bill)
            discounted_price = new_price
          end

          invoice.invoice_items.new(
            consume_bill: item_attributes[:consume_bill],
            discounted_price: discounted_price.round(2),
            item_discount: item_discount.round(2),
            ticket_item_price: ticket_item.price,
            price: new_price.round(2),
            quantity: ticket_item.quantity,
            ticket_item: ticket_item
          )
          total_tax = 0

          total_tax = tax_cal(ticket_item, total_tax, discounted_price)
          invoice_total = discounted_price + total_tax
          total += invoice_total
          sub_total += discounted_price
        end
        invoice.total = total.round(2)

        raise_error invoice.errors.full_messages.to_sentence unless invoice.save
      end
    end

    update_bill_discount(booking, sub_total) if booking.applied_discount.present?
    true
  end

  def tax_cal(ticket_item, total_tax, discounted_price) # rubocop:disable Metrics/AbcSize
    if ticket_item.gst != 0
      gst = discounted_price * (ticket_item.gst / 100)
      total_tax += gst
    end

    if ticket_item.hst != 0
      hst = discounted_price * (ticket_item.hst / 100)
      total_tax += hst
    end

    if ticket_item.pst != 0
      pst = discounted_price * (ticket_item.pst / 100)
      total_tax += pst
    end

    if ticket_item.rst != 0
      rst = discounted_price * (ticket_item.rst / 100)
      total_tax += rst
    end

    if ticket_item.qst != 0
      qst = discounted_price * (ticket_item.qst / 100)
      total_tax += qst
    end

    total_tax
  end

  def update_bill_discount(booking, sub_total) # rubocop:disable Metrics/AbcSize, Metrics/PerceivedComplexity, Metrics/CyclomaticComplexity
    invoices = InvoicePolicy.new(context[:current_user]).scope.where(booking_id: booking.id)

    inv_discount_type = booking.applied_discount.discount_type if booking.applied_discount.present?
    inv_discount = booking.applied_discount.value if booking.applied_discount.present?

    invoices.each do |invoice|
      inv_total = invoice.invoice_items.sum(:discounted_price)
      invoice_total = 0
      invoice.invoice_items.each do |invoice_item|
        discounted_price = if invoice_item.discounted_price.zero?
                             invoice_item.price
                           else
                             invoice_item.discounted_price
                           end
        if inv_discount_type == "percentage"
          discounted_price -= (discounted_price * (inv_discount / 100))
          item_discount = invoice_item.price - discounted_price
        elsif inv_discount_type == "flat"
          inv_ratio = inv_total / sub_total
          inv_per_discount = inv_ratio * inv_discount
          new_inv_discount = inv_per_discount / inv_total
          discounted_price -= (discounted_price * new_inv_discount)
          item_discount = invoice_item.price - discounted_price
        end
        invoice_item.update(
          discounted_price: discounted_price.round(2),
          item_discount: item_discount.round(2)
        )
        total_tax = 0
        ticket_item = TicketItemPolicy.new(context[:current_user]).scope.find(invoice_item.ticket_item_id)

        total_tax = tax_cal(ticket_item, total_tax, discounted_price)
        invoice_total = invoice_total + discounted_price + total_tax
      end
      invoice.total = invoice_total.round(2)

      raise_error invoice.errors.full_messages.to_sentence unless invoice.save
    end
  end
end
