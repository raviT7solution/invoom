# frozen_string_literal: true

class Types::DashboardSummaryType < Types::BaseObject
  field :avg_booking_revenue, Float, null: false
  field :avg_invoice_revenue, Float, null: false
  field :avg_pax_revenue, Float, null: false
  field :booking_count, Integer, null: false
  field :card_revenue, Float, null: false
  field :cash_revenue, Float, null: false
  field :cheque_revenue, Float, null: false
  field :delivery_revenue, Float, null: false
  field :dine_in_revenue, Float, null: false
  field :door_dash_revenue, Float, null: false
  field :gift_card_revenue, Float, null: false
  field :hourly_revenue, [Float], null: false
  field :invoice_count, Integer, null: false
  field :other_revenue, Float, null: false
  field :pax_count, Integer, null: false
  field :skip_the_dishes_revenue, Float, null: false
  field :takeout_revenue, Float, null: false
  field :total_discounts, Float, null: false
  field :total_gross_sales, Float, null: false
  field :total_net_sales, Float, null: false
  field :total_service_charges, Float, null: false
  field :total_taxes, Float, null: false
  field :total_tips, Float, null: false
  field :total_voids, Float, null: false
  field :uber_eats_revenue, Float, null: false
  field :void_revenue, Float, null: false

  def avg_booking_revenue
    return 0 if booking_count.zero?

    total_net_sales / booking_count
  end

  def avg_invoice_revenue
    return 0 if invoice_count.zero?

    total_net_sales / invoice_count
  end

  def avg_pax_revenue
    return 0 if pax_count.zero?

    total_net_sales / pax_count
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

  def cheque_revenue
    payment_mode_revenue["cheque"] || 0
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

  def gift_card_revenue
    payment_mode_revenue["gift_card"] || 0
  end

  def hourly_revenue
    tz = object[:restaurant].timezone

    invoices.group_by_hour_of_day(:created_at, time_zone: tz).sum("invoice_summaries.total").values
  end

  def invoice_count
    @invoice_count ||= invoices.size
  end

  def other_revenue
    payment_mode_revenue["other"] || 0
  end

  def pax_count
    @pax_count ||= object[:bookings].sum(:pax)
  end

  def skip_the_dishes_revenue
    payment_mode_revenue["skip_the_dishes"] || 0
  end

  def takeout_revenue
    booking_type_revenue["takeout"] || 0
  end

  def total_discounts
    @total_discounts ||= begin
      invoice_items = InvoiceItem.arel_table
      invoice_item_summaries = InvoiceItemSummary.arel_table

      expression = invoice_items[:price] - invoice_item_summaries[:discounted_amount]

      invoices.joins(invoice_items: :invoice_item_summary).sum(expression)
    end
  end

  def total_gross_sales
    total_net_sales + total_discounts + total_taxes
  end

  def total_net_sales
    @total_net_sales ||= begin
      invoice_summaries = InvoiceSummary.arel_table

      invoices.sum(invoice_summaries[:subtotal] + invoice_summaries[:total_service_charge])
    end
  end

  def total_service_charges
    @total_service_charges ||= invoices.sum(InvoiceSummary.arel_table[:total_service_charge])
  end

  def total_taxes
    @total_taxes ||= begin
      invoice_summaries = InvoiceSummary.arel_table

      invoices.sum(invoice_summaries[:subtotal_tax] + invoice_summaries[:total_service_charge_tax])
    end
  end

  def total_tips
    payments.sum(:tip)
  end

  def total_voids
    payment_mode_revenue["void"] || 0
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

  def invoices
    Invoice.joins(:booking, :invoice_summary).where(booking_id: object[:bookings]).not_void
  end

  def payment_mode_revenue
    @payment_mode_revenue ||= payments.group(:payment_mode).sum(:amount)
  end

  def payments
    Payment.joins(invoice: :booking).where(bookings: { id: object[:bookings] })
  end
end
