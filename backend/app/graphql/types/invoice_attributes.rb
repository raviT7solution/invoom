# frozen_string_literal: true

class Types::InvoiceAttributes < Types::BaseInputObject
  argument :inv_total, Float, required: false
  argument :invoice_type, Types::Invoice::InvoiceTypeEnum, required: false
  argument :total, Float, required: false

  argument :invoice_items, [Types::InvoiceItemAttributes], required: false
end
