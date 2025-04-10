# frozen_string_literal: true

class Reservation < ApplicationRecord
  belongs_to :restaurant
  belongs_to :customer

  enum :status, [:pending, :seated, :confirmed, :wait_listed, :checked_in, :no_show, :cancelled], default: :pending

  validates :adults, presence: true, numericality: { greater_than: 0 }
  validates :kids, presence: true
  validates :reservation_at, presence: true
  validates :status, presence: true

  after_create_commit :send_create_sms, if: ->(i) { i.restaurant.twilio_configured? }
  after_update_commit :send_update_sms, if: ->(i) { i.restaurant.twilio_configured? }

  private

  def send_create_sms # rubocop:disable Metrics/AbcSize
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

  def send_update_sms # rubocop:disable Metrics/AbcSize
    return unless saved_changes.keys.intersect?(["customer_id", "adults", "kids", "reservation_at"])

    reservation_at_tz = reservation_at.in_time_zone(restaurant.timezone)

    body = <<~BODY
      Dear Customer, your reservation at #{restaurant.name} has been updated!
      Date: #{reservation_at_tz.strftime('%m-%d-%Y')}
      Time: #{reservation_at_tz.strftime('%I:%M %p')}
      Guests: #{adults + kids}
      We look forward to serving you!
      If you need to make further changes or cancel, please call us at #{restaurant.phone_number}.
      See you soon!
    BODY

    TwilioJob.perform_later(restaurant, body: body, to: customer.phone_number_in_e164)
  end
end
