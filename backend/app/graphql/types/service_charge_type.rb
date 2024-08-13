# frozen_string_literal: true

class Types::ServiceChargeType < Types::BaseObject
  field :charge_type, Types::ServiceCharge::ChargeTypeEnum, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :tax_id, ID, null: false
  field :value, Float, null: false
  field :visible, Boolean, null: false
end
