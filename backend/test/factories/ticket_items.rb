# frozen_string_literal: true

FactoryBot.define do
  factory :ticket_item do
    display_name { Faker::Food.name }
    gst { Faker::Number.decimal(l_digits: 2) }
    hst { Faker::Number.decimal(l_digits: 2) }
    modifiers { [Faker::Food.ingredient] }
    name { Faker::Food.name }
    note { Faker::Food.description }
    price { 2.0 }
    pst { Faker::Number.decimal(l_digits: 2) }
    qst { Faker::Number.decimal(l_digits: 2) }
    quantity { 2 }
    rst { Faker::Number.decimal(l_digits: 2) }
    status { TicketItem.status.keys.sample }

    item { nil }
    ticket { nil }
  end
end
