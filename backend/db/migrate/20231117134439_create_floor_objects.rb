# frozen_string_literal: true

class CreateFloorObjects < ActiveRecord::Migration[7.0]
  def change
    create_table :floor_objects, id: :uuid do |t|
      t.references :restaurant, null: false, foreign_key: true, type: :uuid
      t.string :name, null: false
      t.integer :object_type, null: false
      t.json :data, null: false

      t.timestamps
      t.index [:name, :restaurant_id], unique: true
    end
  end
end
