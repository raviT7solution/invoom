# frozen_string_literal: true

FactoryBot.define do
  factory :service_charge do
    sequence(:name) { |i| "Charge #{i}" }

    charge_type { "percentage" }
    value { 10 }
    visible { true }

    restaurant { nil }
    tax { nil }
  end
end
