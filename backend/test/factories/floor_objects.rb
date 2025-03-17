# frozen_string_literal: true

FactoryBot.define do
  factory :floor_object do
    sequence(:name) { |n| "Table - #{n}" }

    data { nil }
    object_type { "table" }

    restaurant { nil }

    trait :speaker do
      data do
        {
          addons: nil,
          length: 1,
          rotate: 90,
          translateX: 40,
          translateY: 40,
          width: 1
        }
      end
    end

    trait :rectangular_table do
      data do
        {
          addons: { type: "rectangular", chairQuantity: [4, 2, 2, 2] },
          length: 1,
          rotate: 90,
          translateX: 40,
          translateY: 40,
          width: 1
        }
      end
    end
  end
end
