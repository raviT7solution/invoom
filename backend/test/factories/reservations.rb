# frozen_string_literal: true

FactoryBot.define do
  factory :reservation do
    pax { 1 }
    reservation_at { 2.days.ago.iso8601 }
    status { "pending" }

    customer { nil }
    restaurant { nil }
  end
end
