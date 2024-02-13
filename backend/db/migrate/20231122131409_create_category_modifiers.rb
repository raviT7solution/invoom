# frozen_string_literal: true

class CreateCategoryModifiers < ActiveRecord::Migration[7.0]
  def change
    create_table :category_modifiers, id: :uuid do |t|
      t.references :category, null: false, foreign_key: true, type: :uuid
      t.references :modifier, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
