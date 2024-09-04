# frozen_string_literal: true

class AddTaxpayerIdAndWebsiteToRestaurants < ActiveRecord::Migration[7.0]
  def change
    change_table :restaurants, bulk: true do |t|
      t.string :taxpayer_id
      t.string :website
    end
  end
end
