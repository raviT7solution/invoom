# frozen_string_literal: true

class Invoice < ApplicationRecord
  scope :completed, -> { joins(:booking).where.not(bookings: { clocked_out_at: nil }) }
  scope :not_void, -> { where(id: Payment.not_void.select(:invoice_id)) }

  belongs_to :booking

  has_many :invoice_items, dependent: :destroy
  has_many :payments, dependent: :restrict_with_error

  has_one :invoice_summary # rubocop:disable Rails/HasManyOrHasOneDependent

  enum :invoice_type, [:simple, :split_equally, :custom_split]

  validates :invoice_type, presence: true
  validates :primary, inclusion: [true, false]

  def completed?
    invoice_summary.total == payments.sum(:amount)
  end

  def self.service_charge_summaries # rubocop:disable Metrics/AbcSize
    iis = InvoiceItemSummary.arel_table
    bsc = BookingServiceCharge.arel_table

    invoice_counts = Arel::Table.new("invoice_counts")
    subtotals = Arel::Table.new("subtotals")

    subtotals_query = Invoice.joins(invoice_items: :invoice_item_summary)
                             .select(:id, iis[:discounted_amount].sum.as("subtotal"))
                             .group(:id)

    value = bsc[:charge_type].when(BookingServiceCharge.charge_types[:percentage])
                             .then(subtotals[:subtotal] * bsc[:value] / 100)
                             .when(BookingServiceCharge.charge_types[:flat])
                             .then(bsc[:value] / invoice_counts[:count])
                             .else(0.0)

    Invoice.with(
      invoice_counts: Invoice.group(:booking_id).select(:booking_id, "COUNT(invoices.id) AS count"),
      subtotals: subtotals_query
    ).joins(
      "JOIN booking_service_charges ON booking_service_charges.booking_id = invoices.booking_id",
      "JOIN subtotals ON subtotals.id = invoices.id",
      "JOIN invoice_counts ON invoice_counts.booking_id = invoices.booking_id"
    ).select(
      :id,
      value.as("value"),
      bsc[:name]
    )
  end
end
