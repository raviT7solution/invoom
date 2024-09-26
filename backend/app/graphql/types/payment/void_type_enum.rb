# frozen_string_literal: true

class Types::Payment::VoidTypeEnum < Types::BaseEnum
  graphql_name "PaymentVoidTypeEnum"

  Payment.void_types.each_key { |i| value(i, value: i) }
end
