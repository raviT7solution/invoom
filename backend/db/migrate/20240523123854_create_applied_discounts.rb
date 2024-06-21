# frozen_string_literal: true

class CreateAppliedDiscounts < ActiveRecord::Migration[7.0]
  def change
    create_table :applied_discounts, id: :uuid do |t|
      t.string :name, null: false
      t.integer :discount_type, null: false
      t.float :value, null: false

      t.references :discountable, null: false, polymorphic: true, type: :uuid, index: { unique: true }
      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
