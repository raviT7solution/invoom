# frozen_string_literal: true

FactoryBot.define do
  factory :invoice_item do
    consume_bill { Faker::Number.number(digits: 1) }
    discounted_price { Faker::Number.decimal(l_digits: 2) }
    item_discount { Faker::Number.decimal(l_digits: 2) }
    price { Faker::Number.decimal(l_digits: 2) }
    quantity { Faker::Number.number(digits: 2) }
    ticket_item_price { Faker::Number.decimal(l_digits: 2) }

    invoice { nil }
    ticket_item { nil }
  end
end
