# frozen_string_literal: true

class Types::InvoiceItemType < Types::BaseObject
  field :consume_bill, Float, null: false
  field :discounted_price, Float, null: false
  field :id, ID, null: false
  field :item_discount, Float, null: false
  field :price, Float, null: false
  field :quantity, Float, null: false
  field :ticket_item_price, Float, null: false

  field :ticket_item, Types::TicketItemType, scope: "TicketItemPolicy", preload: :ticket_item, null: false
end
