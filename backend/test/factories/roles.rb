# frozen_string_literal: true

FactoryBot.define do
  factory :role do
    name { Faker::Company.profession }
    permissions { [] }

    restaurant { nil }
  end
end
