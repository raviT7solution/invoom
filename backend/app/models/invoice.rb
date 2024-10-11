# frozen_string_literal: true

class Invoice < ApplicationRecord
  scope :completed, -> { joins(:booking).where.not(bookings: { clocked_out_at: nil }) }
  scope :not_void, -> { where(id: Payment.not_void.select(:invoice_id)) }

  belongs_to :booking

  has_many :invoice_items, dependent: :destroy
  has_many :invoice_service_charges, dependent: :destroy
  has_many :payments, dependent: :restrict_with_error

  has_one :invoice_summary # rubocop:disable Rails/HasManyOrHasOneDependent

  enum :invoice_type, [:simple, :split_equally, :custom_split]

  validates :invoice_type, presence: true
  validates :primary, inclusion: [true, false]

  def completed?
    invoice_summary.total == payments.sum(:amount)
  end
end
