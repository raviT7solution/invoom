# frozen_string_literal: true

FactoryBot.define do
  factory :customer do
    country_code { Faker::PhoneNumber.country_code }
    email { Faker::Internet.email }
    name { Faker::Name.name }
    phone_number { Faker::Number.number(digits: 10) }

    restaurant { nil }
  end
end
