# frozen_string_literal: true

class Booking < ApplicationRecord
  enum :booking_type, {
    dine_in: 0,
    takeout: 1,
    delivery: 2
  }

  belongs_to :customer, optional: true
  belongs_to :restaurant
  belongs_to :user

  has_many :booking_tables, dependent: :destroy
  has_many :tickets, dependent: :restrict_with_error

  validates :booking_tables, length: { is: 0 }, unless: :dine_in?
  validates :booking_tables, length: { minimum: 1 }, if: :dine_in?
  validates :booking_type, presence: true
  validates :clocked_in_at, presence: true
  validates :customer_id, absence: true, if: :dine_in?
  validates :customer_id, presence: true, unless: :dine_in?
  validates :pax, comparison: { greater_than: 0 }, if: :dine_in?

  before_create :set_token, if: :takeout?

  private

  def set_token
    Time.use_zone(restaurant.timezone) do
      t = restaurant.bookings.where(created_at: DateTime.current.all_day).maximum(:token) || 0

      self.token = t + 1
    end
  end
end
