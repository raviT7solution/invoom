# frozen_string_literal: true

FactoryBot.define do
  factory :invoice do
    sequence(:number) { |n| n }

    invoice_type { "simple" }
    primary { false }
    total { Faker::Number.decimal(l_digits: 2) }

    booking { nil }
  end
end
