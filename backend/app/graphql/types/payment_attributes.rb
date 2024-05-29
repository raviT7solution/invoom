# frozen_string_literal: true

class Types::PaymentAttributes < Types::BaseInputObject
  argument :mode, enum("PaymentModeAttribute", ["cash"]), required: false
end
