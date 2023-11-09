# frozen_string_literal: true

class CreateAdminRestaurants < ActiveRecord::Migration[7.0]
  def change
    create_table :admin_restaurants, id: :uuid do |t|
      t.references :admin, null: false, foreign_key: true, type: :uuid
      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps

      t.index [:admin_id, :restaurant_id], unique: true
    end
  end
end
