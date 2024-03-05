# frozen_string_literal: true

class DropUserRestaurantsTable < ActiveRecord::Migration[7.0]
  def change
    drop_table :user_restaurants do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps

      t.index [:user_id, :restaurant_id], unique: true
    end
  end
end
