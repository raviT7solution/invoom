# frozen_string_literal: true

class AddTaxToItems < ActiveRecord::Migration[7.0]
  change_table :items, bulk: true do |t|
    t.references :tax, null: false, foreign_key: true, type: :uuid
  end
end
