# frozen_string_literal: true

class InvoiceItem < ApplicationRecord
  belongs_to :invoice
  belongs_to :ticket_item

  has_one :invoice_item_summary # rubocop:disable Rails/HasManyOrHasOneDependent

  validates :consume_bill, presence: true
  validates :price, presence: true
end
