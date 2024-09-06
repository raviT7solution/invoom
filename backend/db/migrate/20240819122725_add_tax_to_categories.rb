# frozen_string_literal: true

class AddTaxToCategories < ActiveRecord::Migration[7.0]
  def change
    change_table :categories, bulk: true do |t|
      t.references :tax, null: true, foreign_key: true, type: :uuid
    end
  end
end
