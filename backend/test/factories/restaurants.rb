# frozen_string_literal: true

FactoryBot.define do
  factory :restaurant do
    sequence(:email) { |n| "restaurant#{n}@example.com" }

    address { Faker::Address.full_address }
    break_end_time { nil }
    break_start_time { nil }
    business_end_time { nil }
    business_start_time { nil }
    city { Faker::Address.city }
    country { Faker::Address.country_code }
    name { Faker::Restaurant.name }
    operational_since { "2000" }
    phone_number { Faker::PhoneNumber.cell_phone_in_e164 }
    postal_code { Faker::Address.zip_code }
    province { Faker::Address.state_abbr }
    restaurant_type { Faker::Restaurant.type }
    status { "active" }
    timezone { Faker::Address.time_zone }
  end
end
