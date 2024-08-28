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
    object[:invoices].joins(:booking).where(bookings: { booking_type: :delivery }).sum(:total)
  end

  def dine_in_revenue
    object[:invoices].joins(:booking).where(bookings: { booking_type: :dine_in }).sum(:total)
  end

  def door_dash_revenue
    payment_mode_revenue["door_dash"] || 0
  end

  def hourly_revenue
    hourly_revenue = object[:invoices].group("EXTRACT(HOUR FROM invoices.created_at)").select(
      "EXTRACT(HOUR FROM invoices.created_at) AS hour", "SUM(invoices.total) AS revenue"
    )

    hourly_revenue.each_with_object(Array.new(24, 0.0)) { |row, arr| arr[row.hour] = row.revenue }
  end

  def invoice_count
    @invoice_count ||= object[:invoices].size
  end

  def pax_count
    object[:bookings].sum(:pax)
  end

  def skip_the_dishes_revenue
    payment_mode_revenue["skip_the_dishes"] || 0
  end

  def takeout_revenue
    object[:invoices].joins(:booking).where(bookings: { booking_type: :takeout }).sum(:total)
  end

  def total_revenue
    @total_revenue ||= object[:invoices].sum(:total)
  end

  def uber_eats_revenue
    payment_mode_revenue["uber_eats"] || 0
  end

  def void_revenue
    payment_mode_revenue["void"] || 0
  end

  private

  def payment_mode_revenue
    @payment_mode_revenue ||= object[:invoices].group(:payment_mode).sum(:total)
  end
end
