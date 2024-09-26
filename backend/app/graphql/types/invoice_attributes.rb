# frozen_string_literal: true

class Types::InvoiceAttributes < Types::BaseInputObject
  argument :invoice_type, Types::Invoice::InvoiceTypeEnum, required: false

  argument :invoice_items, [Types::InvoiceItemAttributes], required: false
end
