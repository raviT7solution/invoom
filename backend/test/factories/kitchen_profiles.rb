# frozen_string_literal: true

FactoryBot.define do
  factory :kitchen_profile do
    columns { 3 }
    name { Faker::Food.ingredient }
    notify { true }
    rows { 3 }

    printer_configuration { nil }
    restaurant { nil }
  end
end
