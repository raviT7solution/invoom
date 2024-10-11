# frozen_string_literal: true

class Types::DashboardSummaryType < Types::BaseObject
  field :avg_booking_revenue, Float, null: false
  field :avg_invoice_revenue, Float, null: false
  field :booking_count, Integer, null: false
  field :card_revenue, Float, null: false
  field :cash_revenue, Float, null: false
  field :delivery_revenue, Float, null: false
  field :dine_in_revenue, Float, null: false
  field :door_dash_revenue, Float, null: false
  field :hourly_revenue, [Float], null: false
  field :invoice_count, Integer, null: false
  field :pax_count, Integer, null: false
  field :skip_the_dishes_revenue, Float, null: false
  field :takeout_revenue, Float, null: false
  field :total_revenue, Float, null: false
  field :total_tax, Float, null: false
  field :total_tip, Float, null: false
  field :uber_eats_revenue, Float, null: false
  field :void_revenue, Float, null: false

  def avg_booking_revenue
    return 0 if booking_count.zero?

    total_revenue / booking_count
  end

  def avg_invoice_revenue
    return 0 if invoice_count.zero?

    total_revenue / invoice_count
  end

  def booking_count
    @booking_count ||= object[:bookings].size
  end

  def card_revenue
    payment_mode_revenue["card"] || 0
  end

  def cash_revenue
    payment_mode_revenue["cash"] || 0
  end

  def delivery_revenue
    booking_type_revenue["delivery"] || 0
  end

  def dine_in_revenue
    booking_type_revenue["dine_in"] || 0
  end

  def door_dash_revenue
    payment_mode_revenue["door_dash"] || 0
  end

  def hourly_revenue
    tz = object[:restaurant].timezone
    hourly_revenue = invoices
                     .select(
                       "EXTRACT(HOUR FROM (invoices.created_at::timestamptz AT TIME ZONE '#{tz}')) AS hour",
                       "SUM(invoice_summaries.total) AS revenue"
                     )
                     .group("hour")

    hourly_revenue.each_with_object(Array.new(24, 0.0)) { |row, arr| arr[row.hour] = row.revenue }
  end

  def invoice_count
    @invoice_count ||= invoices.size
  end

  def pax_count
    object[:bookings].sum(:pax)
  end

  def skip_the_dishes_revenue
    payment_mode_revenue["skip_the_dishes"] || 0
  end

  def takeout_revenue
    booking_type_revenue["takeout"] || 0
  end

  def total_revenue
    @total_revenue ||= invoices.sum(InvoiceSummary.arel_table[:total])
  end

  def total_tax # rubocop:disable Metrics/AbcSize, GraphQL/ResolverMethodLength
    # object[:invoices] is for only paid invoices
    invoices = InvoicePolicy.new(context[:current_session]).scope.where(booking_id: object[:bookings])
    invoice_items = InvoiceItemPolicy.new(context[:current_user]).scope.where(invoice_id: invoices)

    total_tax_percent = invoice_items.joins(:invoice_item_summary, invoice: :invoice_service_charges)
                                     .where(invoice_service_charges: { charge_type: "percentage" })
                                     .sum(percentage_service_charge_expression)

    invoice_counts = Invoice.group(:booking_id).select(:booking_id, "COUNT(invoices.id) AS invoice_count")

    total_tax_flat = invoices
                     .joins(:invoice_service_charges)
                     .where(invoice_service_charges: { charge_type: "flat" })
                     .joins("INNER JOIN (#{invoice_counts.to_sql}) counts ON counts.booking_id = invoices.booking_id")
                     .sum(flat_service_charge_expression)

    items_tax = invoice_items.joins(:ticket_item, :invoice_item_summary).sum(items_tax_expression)

    total_tax_percent + total_tax_flat + items_tax
  end

  def total_tip
    payments.sum(:tip)
  end

  def uber_eats_revenue
    payment_mode_revenue["uber_eats"] || 0
  end

  def void_revenue
    payment_mode_revenue["void"] || 0
  end

  private

  def booking_type_revenue
    @booking_type_revenue ||= invoices.group(Booking.arel_table[:booking_type]).sum(InvoiceSummary.arel_table[:total])
  end

  def flat_service_charge_expression # rubocop:disable Metrics/AbcSize
    invoices = Invoice.arel_table.alias(:counts)
    service_charges = InvoiceServiceCharge.arel_table

    tax_expression = (
      service_charges[:hst] +
      service_charges[:gst] +
      service_charges[:rst] +
      service_charges[:pst] +
      service_charges[:qst] +
      service_charges[:cst]
    ) / 100

    (service_charges[:value] / invoices[:invoice_count]) * tax_expression
  end

  def invoices
    Invoice.joins(:booking, :invoice_summary).where(booking_id: object[:bookings]).not_void
  end

  def items_tax_expression
    invoice_item_summaries = InvoiceItemSummary.arel_table
    ticket_items = TicketItem.arel_table

    invoice_item_summaries[:discounted_amount] * (
      ticket_items[:cst] +
      ticket_items[:gst] +
      ticket_items[:hst] +
      ticket_items[:pst] +
      ticket_items[:qst] +
      ticket_items[:rst]
    ) / 100
  end

  def payment_mode_revenue
    @payment_mode_revenue ||= payments.group(:payment_mode).sum(:amount)
  end

  def payments
    Payment.joins(invoice: :booking).where(bookings: { id: object[:bookings] })
  end

  def percentage_service_charge_expression # rubocop:disable Metrics/AbcSize
    invoice_item_summaries = InvoiceItemSummary.arel_table
    service_charges = InvoiceServiceCharge.arel_table

    tax_expression = (
      service_charges[:hst] +
      service_charges[:gst] +
      service_charges[:rst] +
      service_charges[:pst] +
      service_charges[:qst] +
      service_charges[:cst]
    ) / 100

    invoice_item_summaries[:discounted_amount] * (service_charges[:value] / 100) * tax_expression
  end
end
