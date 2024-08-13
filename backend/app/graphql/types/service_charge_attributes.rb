# frozen_string_literal: true

class Types::ServiceChargeAttributes < Types::BaseInputObject
  argument :charge_type, Types::ServiceCharge::ChargeTypeEnum, required: false
  argument :name, String, required: false
  argument :tax_id, ID, required: false
  argument :value, Float, required: false
  argument :visible, Boolean, required: false
end
