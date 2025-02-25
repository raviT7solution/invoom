# frozen_string_literal: true

FactoryBot.define do
  factory :customer do
    country_code { "+1" }
    email { Faker::Internet.email }
    name { Faker::Name.name }
    phone_number { Faker::PhoneNumber.cell_phone_in_e164 }

    restaurant { nil }
  end
end
