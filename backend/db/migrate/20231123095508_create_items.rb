# frozen_string_literal: true

class CreateItems < ActiveRecord::Migration[7.0]
  def change
    create_table :items, id: :uuid do |t|
      t.string :name, null: false
      t.string :display_name, null: false
      t.string :description, null: false
      t.float :price, null: false
      t.float :cost_of_production, null: false
      t.float :takeout_price, null: false
      t.float :delivery_price, null: false
      t.boolean :visible, default: true, null: false

      t.references :category, null: false, foreign_key: true, type: :uuid
      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps
      t.index [:name, :restaurant_id], unique: true
    end
  end
end
