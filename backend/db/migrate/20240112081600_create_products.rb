# frozen_string_literal: true

class CreateProducts < ActiveRecord::Migration[7.0]
  def change
    create_table :products, id: :uuid do |t|
      t.boolean :visible, default: true, null: false
      t.float :price, null: false
      t.float :reorder_point, null: false
      t.float :stock_limit, null: false
      t.float :weight, null: false
      t.string :description, null: false
      t.string :item_code, null: false
      t.string :name, null: false
      t.string :uom, null: false

      t.references :inventory_category, null: false, foreign_key: true, type: :uuid
      t.references :restaurant, null: false, foreign_key: true, type: :uuid
      t.references :tax, null: false, foreign_key: true, type: :uuid

      t.timestamps

      t.index [:item_code, :restaurant_id], unique: true
    end
  end
end
