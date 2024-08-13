# frozen_string_literal: true

class Types::ServiceCharge::ChargeTypeEnum < Types::BaseEnum
  graphql_name "ServiceChargeTypeEnum"

  ServiceCharge.charge_types.each_key { |i| value(i, value: i) }
end
