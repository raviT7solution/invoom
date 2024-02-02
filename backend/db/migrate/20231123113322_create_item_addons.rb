# frozen_string_literal: true

class CreateItemAddons < ActiveRecord::Migration[7.0]
  def change
    create_table :item_addons, id: :uuid do |t|
      t.references :item, null: false, foreign_key: true, type: :uuid
      t.references :addon, null: false, foreign_key: true, type: :uuid

      t.timestamps
      t.index [:item_id, :addon_id], unique: true
    end
  end
end
