# frozen_string_literal: true

class CreateUserRestaurants < ActiveRecord::Migration[7.0]
  def change
    create_table :user_restaurants, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps

      t.index [:user_id, :restaurant_id], unique: true
    end
  end
end
