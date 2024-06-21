# frozen_string_literal: true

class CreateItemDiscounts < ActiveRecord::Migration[7.0]
  def change
    create_table :item_discounts, id: :uuid do |t|
      t.references :item, null: false, foreign_key: true, type: :uuid
      t.references :discount, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
