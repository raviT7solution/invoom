# frozen_string_literal: true

FactoryBot.define do
  factory :invoice do
    sequence(:number) { |n| n }

    invoice_type { "simple" }
    primary { false }

    booking { nil }
  end
end
