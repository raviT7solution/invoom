# frozen_string_literal: true

FactoryBot.define do
  factory :payment do
    amount { Faker::Number.decimal(l_digits: 2) }
    brand { nil }
    card_number { nil }
    funding { nil }
    issuer { nil }
    payment_intent_id { nil }
    payment_mode { "cash" }
    tip { Faker::Number.decimal(l_digits: 2) }
    void_type { nil }

    invoice { nil }
  end
end
