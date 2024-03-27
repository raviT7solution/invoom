# frozen_string_literal: true

FactoryBot.define do
  factory :inventory_category do
    name { Faker::Food.ethnic_category }
    description { Faker::Food.ethnic_category }
    visible { true }

    restaurant { nil }
  end
end
