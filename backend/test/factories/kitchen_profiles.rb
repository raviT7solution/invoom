# frozen_string_literal: true

FactoryBot.define do
  factory :kitchen_profile do
    columns { 3 }
    name { Faker::Food.ingredient }
    notify { true }
    rows { 3 }

    restaurant { nil }
  end
end
