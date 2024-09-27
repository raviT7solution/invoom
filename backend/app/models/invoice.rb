# frozen_string_literal: true

class Invoice < ApplicationRecord
  scope :completed, -> { joins(:booking).where.not(bookings: { clocked_out_at: nil }) }

  belongs_to :booking

  has_many :invoice_items, dependent: :destroy
  has_many :invoice_service_charges, dependent: :destroy
  has_many :payments, dependent: :restrict_with_error

  enum :invoice_type, [:simple, :split_equally, :custom_split]

  validates :invoice_type, presence: true
  validates :primary, inclusion: [true, false]
  validates :total, presence: true

  def completed?
    total == payments.sum(:amount)
  end

  def update_amount!
    amount_with_tax = invoice_items.sum do |i|
      Tax.amount_with_tax(i.ticket_item, i.invoice_item_summary.discounted_amount)
    end

    update!(total: amount_with_tax + apply_invoice_service_charge)
  end

  private

  def apply_invoice_service_charge
    sub_total = invoice_items.sum { |item| item.invoice_item_summary.discounted_amount }

    invoice_service_charges.sum do |i|
      value = case i.charge_type
              when "percentage"
                sub_total * i.value / 100.0
              when "flat"
                i.value / booking.invoices.count
              else
                0
              end

      Tax.amount_with_tax(i, value)
    end
  end
end
