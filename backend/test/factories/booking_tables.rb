# frozen_string_literal: true

FactoryBot.define do
  factory :booking_table do
    sequence(:name) { |n| "T - #{n}" }

    booking { nil }
    floor_object { nil }
  end
end
