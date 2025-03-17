# frozen_string_literal: true

FactoryBot.define do
  factory :booking do
    active_user_full_name { nil }
    booking_type { Booking.booking_types.keys.sample }
    clocked_in_at { 2.days.ago.iso8601 }
    clocked_out_at { nil }
    estimated_duration { nil }
    pax { nil }
    table_names { nil }
    token { nil }

    customer { nil }
    restaurant { nil }
    user { nil }
  end
end
