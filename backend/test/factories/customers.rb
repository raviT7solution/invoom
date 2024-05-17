# frozen_string_literal: true

FactoryBot.define do
  factory :customer do
    name { Faker::Name.name }
    phone_number { Faker::PhoneNumber.cell_phone_in_e164 }

    restaurant { nil }
  end
end
