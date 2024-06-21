# frozen_string_literal: true

FactoryBot.define do
  factory :applied_discount do
    discount_type { "flat" }
    name { Faker::Commerce.promotion_code }
    value { 1 }

    discountable { nil }
    restaurant { nil }
  end
end
