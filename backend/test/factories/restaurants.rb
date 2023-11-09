# frozen_string_literal: true

FactoryBot.define do
  factory :restaurant do
    address { Faker::Address.full_address }
    name { Faker::Restaurant.name }
  end
end
