# frozen_string_literal: true

class Reservation < ApplicationRecord
  belongs_to :restaurant
  belongs_to :customer

  enum :status, [:pending, :seated, :confirmed, :wait_listed, :checked_in, :no_show, :cancelled], default: :pending

  validates :adults, presence: true, numericality: { greater_than: 0 }
  validates :kids, presence: true
  validates :reservation_at, presence: true
  validates :status, presence: true

  after_create_commit :send_sms, if: ->(i) { i.restaurant.twilio_configured? }

  private

  def send_sms # rubocop:disable Metrics/AbcSize
    reservation_at_tz = reservation_at.in_time_zone(restaurant.timezone)

    body = <<~BODY
      Dear Customer, your reservation is confirmed at #{restaurant.name}!
      Date: #{reservation_at_tz.strftime('%m-%d-%Y')}
      Time: #{reservation_at_tz.strftime('%I:%M %p')}
      Guests: #{adults + kids}
      We look forward to serving you!
      If you need to modify or cancel, call us at #{restaurant.phone_number}.
      See you soon!
    BODY

    TwilioJob.perform_later(restaurant, body: body, to: customer.phone_number_in_e164)
  end
end
