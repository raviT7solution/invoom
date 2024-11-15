# frozen_string_literal: true

FactoryBot.define do
  factory :booking_service_charge do
    sequence(:name) { |n| "Booking Service Charge #{n}" }

    charge_type { "flat" }
    cst { Faker::Number.decimal(l_digits: 2) }
    gst { Faker::Number.decimal(l_digits: 2) }
    hst { Faker::Number.decimal(l_digits: 2) }
    pst { Faker::Number.decimal(l_digits: 2) }
    qst { Faker::Number.decimal(l_digits: 2) }
    rst { Faker::Number.decimal(l_digits: 2) }
    value { 10 }

    booking { nil }
    service_charge { nil }
  end
end
