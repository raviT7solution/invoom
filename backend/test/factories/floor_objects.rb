# frozen_string_literal: true

FactoryBot.define do
  factory :floor_object do
    sequence(:name) { |n| "Table - #{n}" }

    data { { id: Faker::Lorem.word } }
    object_type { "table" }

    restaurant { nil }
  end
end
