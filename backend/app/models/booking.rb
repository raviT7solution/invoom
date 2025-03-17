# frozen_string_literal: true

class Booking < ApplicationRecord
  scope :clocked_in, -> { where(clocked_out_at: nil) }
  scope :clocked_out, -> { where.not(clocked_out_at: nil) }
  scope :search, ->(q) { left_joins(:invoices).where("bookings.number = :q OR invoices.number = :q", q: q).group(:id) }
  scope :where_payment_modes, ->(i) { joins(invoices: :payments).where(payments: { payment_mode: i }).group(:id) }
  scope :where_table_names_in, ->(arr) { where("bookings.table_names && ARRAY[?]::varchar[]", arr) }

  enum :booking_type, {
    dine_in: 0,
    takeout: 1,
    delivery: 2
  }

  belongs_to :customer, optional: true
  belongs_to :restaurant
  belongs_to :user

  has_many :booking_service_charges, dependent: :destroy
  has_many :invoices, dependent: :restrict_with_error
  has_many :tickets, dependent: :destroy

  has_one :applied_discount, as: :discountable, dependent: :destroy

  validates :booking_type, presence: true
  validates :clocked_in_at, presence: true
  validates :customer_id, presence: true, if: :delivery?
  validates :estimated_duration, absence: true, if: :dine_in?
  validates :pax, comparison: { greater_than: 0 }, if: :dine_in?
  validates :table_names, absence: true, if: -> { takeout? || delivery? }
  validates :table_names, presence: true, if: :dine_in?

  validate :validate_clocked_out_at, if: ->(i) { i.clocked_out_at.present? && i.clocked_out_at_changed? }

  before_create :set_token, if: -> { takeout? || delivery? }
  after_destroy :broadcast_update
  after_update_commit :broadcast_update, if: ->(i) { i.saved_change_to_active_user_full_name? || i.saved_change_to_clocked_out_at? } # rubocop:disable Layout/LineLength

  private

  def broadcast_update
    BookingChannel.broadcast_to(self, { event: "disconnect" }) if active_user_full_name.blank?

    FloorObjectsChannel.broadcast_to(restaurant, {})
  end

  def set_token
    Time.use_zone(restaurant.timezone) do
      t = restaurant.bookings.where(created_at: DateTime.current.all_day).maximum(:token) || 0

      self.token = t + 1
    end
  end

  def validate_clocked_out_at
    errors.add(:base, "Unprocessed invoice(s)") if invoices.blank? || !invoices.all?(&:completed?)
  end
end
