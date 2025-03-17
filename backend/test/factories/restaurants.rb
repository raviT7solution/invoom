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
    payment_publishable_key { nil }
    payment_secret_key { nil }
    phone_number { Faker::PhoneNumber.cell_phone_in_e164 }
    pin { nil }
    postal_code { Faker::Address.zip_code }
    province { Faker::Address.state_abbr }
    restaurant_type { Faker::Restaurant.type }
    status { "active" }
    stripe_account_id { nil }
    stripe_account_type { nil }
    taxpayer_id { nil }
    timezone { Faker::Address.time_zone }
    twilio_account_sid { nil }
    twilio_auth_token { nil }
    twilio_sms_phone_number { nil }
    website { nil }
  end
end
