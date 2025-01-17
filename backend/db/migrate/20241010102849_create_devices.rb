# frozen_string_literal: true

class CreateDevices < ActiveRecord::Migration[7.0]
  def change
    create_table :devices, id: :uuid do |t|
      t.string :fingerprint, null: false
      t.string :name, null: false

      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps
      t.index [:fingerprint, :restaurant_id], unique: true
    end
  end
end
