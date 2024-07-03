# frozen_string_literal: true

class Types::Invoice::PaymentModeEnum < Types::BaseEnum
  graphql_name "InvoicePaymentModeEnum"

  Invoice.payment_modes.each_key { |i| value(i, value: i) }
end
