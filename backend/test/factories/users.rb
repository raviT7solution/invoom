# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    address { nil }
    city { nil }
    country { "CA" }
    email { Faker::Internet.email }
    employment_type { "salary" }
    end_date { nil }
    first_name { Faker::Internet.username }
    gender { "male" }
    last_name { Faker::Internet.username }
    max_hour { 0 }
    password { "password@123" }
    phone_number { Faker::PhoneNumber.cell_phone_in_e164 }
    pin { Faker::Number.number(digits: 4).to_s }
    preferred_name { Faker::Internet.username }
    province { "ON" }
    start_date { "01/01/2023" }
    wage { 1 }
    zip_code { Faker::Address.zip_code }
  end
end
