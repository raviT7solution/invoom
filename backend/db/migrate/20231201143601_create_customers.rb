# frozen_string_literal: true

class CreateCustomers < ActiveRecord::Migration[7.0]
  def change
    create_table :customers, id: :uuid do |t|
      t.string :name, null: false
      t.string :email, null: true
      t.string :phone_number, null: false
      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps

      t.index [:email, :restaurant_id], unique: true
    end
  end
end
