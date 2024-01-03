# frozen_string_literal: true

class CreateMenuCategories < ActiveRecord::Migration[7.0]
  def change
    create_table :menu_categories, id: :uuid do |t|
      t.references :menu, null: false, foreign_key: true, type: :uuid
      t.references :category, null: false, foreign_key: true, type: :uuid

      t.timestamps
      t.index [:menu_id, :category_id], unique: true
    end
  end
end
