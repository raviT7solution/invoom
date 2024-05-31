# frozen_string_literal: true

class CreateKitchenProfileCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :kitchen_profile_categories, id: :uuid do |t|
      t.references :kitchen_profile, null: false, foreign_key: true, type: :uuid
      t.references :category, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
