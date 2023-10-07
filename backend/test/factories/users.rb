# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    address { nil }
    city { nil }
    email { Faker::Internet.email }
    end_date { nil }
    first_name { Faker::Internet.username }
    gender { "male" }
    last_name { Faker::Internet.username }
    password { "password@123" }
    phone_number { Faker::PhoneNumber.cell_phone_in_e164 }
    pin { nil }
    start_date { "01/01/2023" }
    username { Faker::Internet.username }
    wage { 1 }
    zip_code { Faker::Address.zip_code }
  end
end
