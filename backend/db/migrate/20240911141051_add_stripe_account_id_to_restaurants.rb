# frozen_string_literal: true

class AddStripeAccountIdToRestaurants < ActiveRecord::Migration[7.0]
  def change
    change_table :restaurants, bulk: true do |t|
      t.integer :stripe_account_type, null: true
      t.string :stripe_account_id, null: true
    end
  end
end
