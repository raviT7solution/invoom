# frozen_string_literal: true

class Types::Invoice::InvoiceTypeEnum < Types::BaseEnum
  Invoice.invoice_types.each_key { |i| value(i, value: i) }
end
