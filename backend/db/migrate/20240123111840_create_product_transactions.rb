# frozen_string_literal: true

class CreateProductTransactions < ActiveRecord::Migration[7.0]
  def change
    create_table :product_transactions, id: :uuid do |t|
      t.float :price, null: false
      t.integer :stock_type, null: false
      t.float :quantity, null: false

      t.references :product, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
