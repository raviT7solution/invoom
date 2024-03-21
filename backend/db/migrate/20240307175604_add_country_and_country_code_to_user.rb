# frozen_string_literal: true

class AddCountryAndCountryCodeToUser < ActiveRecord::Migration[7.0]
  def change
    change_table :users, bulk: true do |t|
      t.string :country
      t.string :country_code, null: false
    end
  end
end
