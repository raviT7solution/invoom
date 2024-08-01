# frozen_string_literal: true

class Types::InvoiceType < Types::BaseObject
  field :amount_received, String, null: true
  field :brand, String, null: true
  field :card_number, String, null: true
  field :funding, String, null: true
  field :id, ID, null: false
  field :invoice_type, Types::Invoice::InvoiceTypeEnum, null: false
  field :issuer, String, null: true
  field :number, Integer, null: false
  field :payment_mode, Types::Invoice::PaymentModeEnum, null: true
  field :status, Types::Invoice::StatusEnum, null: false
  field :tip, Float, null: false
  field :total, Float, null: false

  field :booking, Types::BookingType, scope: "BookingPolicy", preload: :booking, null: false
  field :invoice_items, [Types::InvoiceItemType], scope: "InvoiceItemPolicy", preload: :invoice_items, null: false
end
