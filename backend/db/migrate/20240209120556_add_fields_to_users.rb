# frozen_string_literal: true

class AddFieldsToUsers < ActiveRecord::Migration[7.0]
  def change
    change_table :users, bulk: true do |t|
      change_column_null :users, :gender, false

      t.remove :pin_digest, type: :string
      t.remove :username, type: :string
      t.string :province
      t.string :preferred_name, null: false
      t.integer :employment_type, null: false
      t.float :max_hour, null: false
      t.string :pin, null: false
      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.index [:pin, :restaurant_id], unique: true
    end
  end
end
