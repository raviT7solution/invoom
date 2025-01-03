# frozen_string_literal: true

FactoryBot.define do
  factory :reservation do
    adults { 2 }
    kids { 1 }
    reservation_at { 2.days.ago.iso8601 }
    special_request { nil }
    status { "pending" }

    customer { nil }
    restaurant { nil }
  end
end
