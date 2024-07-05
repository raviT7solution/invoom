# frozen_string_literal: true

FactoryBot.define do
  factory :invoice do
    invoice_type { "simple" }
    number { "1" }
    payment_mode { "cash" }
    status { "unpaid" }
    total { 100 }
    void_type { nil }

    booking { nil }
  end
end
