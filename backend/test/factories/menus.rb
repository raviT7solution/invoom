# frozen_string_literal: true

FactoryBot.define do
  factory :menu do
    name { Faker::Food.ethnic_category }
    description { Faker::Food.description }
    visible { true }

    restaurant { nil }
  end
end
