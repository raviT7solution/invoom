# frozen_string_literal: true

class AddDetailsToRestaurants < ActiveRecord::Migration[7.0]
  def change
    change_table :restaurants, bulk: true do |t|
      t.string :operational_since, null: false
      t.string :postal_code, null: false
      t.string :city, null: false
      t.string :province, null: false
      t.string :country, null: false
      t.string :phone_number, null: false
      t.string :email, null: false
      t.time :business_start_time, null: true
      t.time :business_end_time, null: true
      t.time :break_start_time, null: true
      t.time :break_end_time, null: true
      t.string :restaurant_type, null: false
      t.string :timezone, null: false
      t.integer :status, null: false
    end
  end
end
