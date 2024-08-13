# frozen_string_literal: true

class Types::InvoiceServiceChargeType < Types::BaseObject
  field :charge_type, Types::ServiceCharge::ChargeTypeEnum, null: false
  field :cst, Float, null: false
  field :gst, Float, null: false
  field :hst, Float, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :pst, Float, null: false
  field :qst, Float, null: false
  field :rst, Float, null: false
  field :value, Float, null: false
end
