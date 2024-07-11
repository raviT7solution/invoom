# frozen_string_literal: true

class AddPaymentKeysToRestaurants < ActiveRecord::Migration[7.0]
  def change
    change_table :restaurants, bulk: true do |t|
      t.string :payment_publishable_key, null: true
      t.string :payment_secret_key, null: true
    end
  end
end
