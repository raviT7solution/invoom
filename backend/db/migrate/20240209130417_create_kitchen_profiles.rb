# frozen_string_literal: true

class CreateKitchenProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :kitchen_profiles, id: :uuid do |t|
      t.string :name, null: false
      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
