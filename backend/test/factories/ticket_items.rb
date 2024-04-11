# frozen_string_literal: true

FactoryBot.define do
  factory :ticket_item do
    display_name { Faker::Food.name }
    modifiers { [Faker::Food.ingredient] }
    name { Faker::Food.name }
    note { Faker::Food.description }
    price { 2.0 }
    quantity { 2 }
    status { TicketItem.status.keys.sample }

    ticket { nil }
  end
end
