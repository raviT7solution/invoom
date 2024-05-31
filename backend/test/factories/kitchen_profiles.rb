# frozen_string_literal: true

FactoryBot.define do
  factory :kitchen_profile do
    name { Faker::Food.ingredient }

    restaurant { nil }
  end
end
