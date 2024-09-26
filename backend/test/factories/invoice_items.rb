# frozen_string_literal: true

FactoryBot.define do
  factory :invoice_item do
    consume_bill { Faker::Number.number(digits: 1) }
    price { Faker::Number.decimal(l_digits: 2) }

    invoice { nil }
    ticket_item { nil }
  end
end
