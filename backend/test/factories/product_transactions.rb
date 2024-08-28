# frozen_string_literal: true

FactoryBot.define do
  factory :product_transaction do
    price { Faker::Commerce.price }
    quantity { 2 }
    stock_type { "receive" }

    product { nil }
  end
end
