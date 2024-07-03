# frozen_string_literal: true

class InvoiceItem < ApplicationRecord
  belongs_to :invoice
  belongs_to :ticket_item

  validates :consume_bill, presence: true
  validates :discounted_price, presence: true
  validates :item_discount, presence: true
  validates :price, presence: true
  validates :quantity, presence: true
  validates :ticket_item_price, presence: true
end
