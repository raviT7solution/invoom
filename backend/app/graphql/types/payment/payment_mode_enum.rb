# frozen_string_literal: true

class Types::Payment::PaymentModeEnum < Types::BaseEnum
  Payment.payment_modes.each_key { |i| value(i, value: i) }
end
