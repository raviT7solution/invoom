# frozen_string_literal: true

class Types::Invoice::StatusEnum < Types::BaseEnum
  graphql_name "InvoiceStatusEnum"

  Invoice.statuses.each_key { |i| value(i, value: i) }
end
