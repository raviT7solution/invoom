# frozen_string_literal: true

class AddEqPriceToAddons < ActiveRecord::Migration[7.0]
  change_table :addons, bulk: true do |t|
    t.boolean :eq_price, null: false, default: false
  end
end
