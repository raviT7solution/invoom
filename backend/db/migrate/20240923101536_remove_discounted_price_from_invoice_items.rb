# frozen_string_literal: true

class RemoveDiscountedPriceFromInvoiceItems < ActiveRecord::Migration[7.0]
  def change
    change_table :invoice_items, bulk: true do |t|
      t.remove :discounted_price, type: :float
      t.remove :item_discount, type: :float
      t.remove :quantity, type: :float
      t.remove :ticket_item_price, type: :float
    end
  end
end
