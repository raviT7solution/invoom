# frozen_string_literal: true

FactoryBot.define do
  factory :receipt_configuration do
    show_customer_details { false }
    show_discount { false }
    show_platform_branding { false }
    show_unit_price { false }

    restaurant { nil }
  end
end
