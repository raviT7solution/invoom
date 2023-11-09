# frozen_string_literal: true

class CreateRoles < ActiveRecord::Migration[7.0]
  def change
    create_table :roles, id: :uuid do |t|
      t.references :restaurant, null: false, foreign_key: true, type: :uuid
      t.string :name
      t.string :permissions, array: true, default: []

      t.timestamps

      t.index [:restaurant_id, :name], unique: true
    end
  end
end
