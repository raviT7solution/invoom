# frozen_string_literal: true

class Types::PaymentType < Types::BaseObject
  field :amount, Float, null: false
  field :brand, String, null: true
  field :card_number, String, null: true
  field :funding, String, null: true
  field :id, ID, null: false
  field :issuer, String, null: true
  field :payment_mode, Types::Payment::PaymentModeEnum, null: false
  field :tip, Float, null: false
end
