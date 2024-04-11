# frozen_string_literal: true

FactoryBot.define do
  factory :booking do
    booking_type { Booking.booking_type.keys.sample }
    clocked_in_at { 2.days.ago.iso8601 }
    clocked_out_at { nil }

    restaurant { nil }
    user { nil }
  end
end
