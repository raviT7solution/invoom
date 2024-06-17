# frozen_string_literal: true

class CreateKitchenProfiles < ActiveRecord::Migration[7.0]
  def change
    create_table :kitchen_profiles, id: :uuid do |t|
      t.boolean :notify, default: true, null: false
      t.integer :columns, null: false
      t.integer :rows, null: false
      t.string :name, null: false

      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
