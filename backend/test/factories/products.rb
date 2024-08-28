# frozen_string_literal: true

FactoryBot.define do
  factory :product do
    available_quantity { 0.0 }
    description { nil }
    item_code { Faker::Barcode.ean }
    name { Faker::Commerce.product_name }
    price { Faker::Commerce.price(range: 0.01..100.0) }
    reorder_point { Faker::Number.between(from: 1, to: 100) }
    stock_limit { Faker::Number.between(from: 10, to: 1000) }
    uom { Faker::Lorem.word }
    visible { true }
    weight { Faker::Number.decimal(l_digits: 2) }

    inventory_category { nil }
    restaurant { nil }
    tax { nil }
  end
end
