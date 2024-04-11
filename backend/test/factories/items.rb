# frozen_string_literal: true

FactoryBot.define do
  factory :item do
    cost_of_production { 2.0 }
    delivery_price { 4.0 }
    description { Faker::Food.description }
    display_name { Faker::Food.dish }
    name { Faker::Food.dish }
    price { 1.0 }
    take_out_price { 3.0 }
    visible { true }

    category { nil }
    restaurant { nil }
  end
end
