# frozen_string_literal: true

class CreateItemModifiers < ActiveRecord::Migration[7.0]
  def change
    create_table :item_modifiers, id: :uuid do |t|
      t.references :item, null: false, foreign_key: true, type: :uuid
      t.references :modifier, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
