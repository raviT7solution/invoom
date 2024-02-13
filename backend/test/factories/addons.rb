# frozen_string_literal: true

FactoryBot.define do
  factory :addon do
    name { Faker::Food.ingredient }
    price { 1.0 }
    takeout_price { 2.0 }
    delivery_price { 3.0 }
    visible { true }
  end
end
