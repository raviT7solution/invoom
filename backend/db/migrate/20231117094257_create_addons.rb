# frozen_string_literal: true

class CreateAddons < ActiveRecord::Migration[7.0]
  def change
    create_table :addons, id: :uuid do |t|
      t.string :name, null: false
      t.float :price, null: false
      t.float :takeout_price, null: false
      t.float :delivery_price, null: false
      t.boolean :visible, default: true, null: false
      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps
      t.index [:name, :restaurant_id], unique: true
    end
  end
end
