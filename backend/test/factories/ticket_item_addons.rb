# frozen_string_literal: true

FactoryBot.define do
  factory :ticket_item_addon do
    name { Faker::Food.dish }
    price { Faker::Number.decimal(l_digits: 2) }

    ticket_item { nil }
  end
end
