# frozen_string_literal: true

class Types::Invoice::StatusEnum < Types::BaseEnum
  graphql_name "InvoiceStatusEnum"

  value "overpaid"
  value "paid"
  value "unpaid"
  value "voided"
end
