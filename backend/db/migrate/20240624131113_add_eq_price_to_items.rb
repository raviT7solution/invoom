# frozen_string_literal: true

class AddEqPriceToItems < ActiveRecord::Migration[7.0]
  change_table :items, bulk: true do |t|
    t.boolean :eq_price, null: false, default: false
  end
end
