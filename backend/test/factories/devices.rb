# frozen_string_literal: true

FactoryBot.define do
  factory :device do
    sequence(:name) { |n| "Device - #{n}" }

    fingerprint { Faker::Device.serial }

    restaurant { nil }
  end
end
