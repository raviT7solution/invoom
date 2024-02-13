# frozen_string_literal: true

class CreateModifiers < ActiveRecord::Migration[7.0]
  def change
    create_table :modifiers, id: :uuid do |t|
      t.string :name, null: false
      t.boolean :visible, default: true, null: false
      t.boolean :global_modifier, default: true, null: false
      t.boolean :multi_select, default: true, null: false
      t.references :restaurant, null: false, foreign_key: true, type: :uuid
      t.string :values, array: true, null: false

      t.timestamps
      t.index [:name, :restaurant_id], unique: true
    end
  end
end
