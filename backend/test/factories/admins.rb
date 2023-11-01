# frozen_string_literal: true

FactoryBot.define do
  factory :admin do
    email { Faker::Internet.email }
    first_name { Faker::Internet.username }
    last_name { Faker::Internet.username }
    password { "password@123" }
  end
end
