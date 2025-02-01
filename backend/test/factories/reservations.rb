# frozen_string_literal: true

FactoryBot.define do
  factory :reservation do
    adults { 2 }
    kids { 1 }
    note { nil }
    reservation_at { 2.days.ago.iso8601 }
    status { "pending" }
    table_name { nil }

    customer { nil }
    restaurant { nil }
  end
end
