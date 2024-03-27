# frozen_string_literal: true

class CreateInventoryCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :inventory_categories, id: :uuid do |t|
      t.string :name, null: false
      t.string :description, null: false
      t.boolean :visible, default: true, null: false
      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps
      t.index [:name, :restaurant_id], unique: true
    end
  end
end
