# frozen_string_literal: true

class Types::PaymentAttributes < Types::BaseInputObject
  argument :mode, Types::Invoice::PaymentModeEnum, required: false
  argument :void_type, enum("InvoiceVoidTypeEnum", Invoice.void_types.keys), required: false
end
