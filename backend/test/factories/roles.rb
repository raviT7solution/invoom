# frozen_string_literal: true

FactoryBot.define do
  factory :role do
    auto_clock_in { true }
    name { Faker::Company.profession }
    permissions { [] }

    restaurant { nil }
  end
end
