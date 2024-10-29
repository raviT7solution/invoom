# frozen_string_literal: true

FactoryBot.define do
  factory :printer_configuration do
    sequence(:name) { |n| "Printer - #{n}" }

    ip_address { Faker::Internet.ip_v4_address }
    port { Faker::Number.between(from: 1024, to: 9999).to_s }
    visible { true }

    restaurant { nil }
  end
end
