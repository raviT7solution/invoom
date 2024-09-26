# frozen_string_literal: true

class Types::InvoiceItemType < Types::BaseObject
  field :consume_bill, Float, null: false
  field :discounted_amount, Float, preload: :invoice_item_summary, null: false
  field :id, ID, null: false
  field :price, Float, null: false

  field :ticket_item, Types::TicketItemType, scope: "TicketItemPolicy", preload: :ticket_item, null: false

  def discounted_amount
    object.invoice_item_summary.discounted_amount
  end
end
