# frozen_string_literal: true

FactoryBot.define do
  factory :discount do
    auto_apply { false }
    black_out_dates { [] }
    capping { 4.0 }
    channels { ["all"] }
    clubbed { false }
    discount_on { "bill_wise" }
    discount_type { "percentage" }
    end_date_time { nil }
    name { Faker::Commerce.promotion_code }
    repeat { ["Thu"] }
    start_date_time { nil }
    threshold { 2.0 }
    value { 10 }
    visible { true }

    restaurant { nil }
  end
end
