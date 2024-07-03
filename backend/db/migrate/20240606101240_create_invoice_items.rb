# frozen_string_literal: true

class CreateInvoiceItems < ActiveRecord::Migration[7.0]
  def change
    create_table :invoice_items, id: :uuid do |t|
      t.float :quantity, null: false
      t.float :consume_bill, null: false
      t.float :price, null: false
      t.float :ticket_item_price, null: false
      t.float :discounted_price, null: false
      t.float :item_discount, null: false

      t.references :ticket_item, null: false, foreign_key: true, type: :uuid
      t.references :invoice, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
