# frozen_string_literal: true

FactoryBot.define do
  factory :invoice do
    sequence(:number) { |n| n }

    amount_received { nil }
    brand { nil }
    card_number { nil }
    funding { nil }
    invoice_type { "simple" }
    issuer { nil }
    payment_intent_id { nil }
    payment_mode { "cash" }
    status { "unpaid" }
    tip { 0 }
    total { 100 }
    void_type { nil }

    booking { nil }
  end
end
