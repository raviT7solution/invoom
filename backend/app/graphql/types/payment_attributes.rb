# frozen_string_literal: true

class Types::PaymentAttributes < Types::BaseInputObject
  argument :amount, Float, required: true
  argument :payment_intent_id, String, required: false
  argument :payment_mode, Types::Payment::PaymentModeEnum, required: false
  argument :tip, Float, required: false
  argument :void_type, Types::Payment::VoidTypeEnum, required: false
end
