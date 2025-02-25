# frozen_string_literal: true

class AddCountryCodeToCustomers < ActiveRecord::Migration[7.0]
  def change
    change_table :customers do |t|
      t.string :country_code, null: true

      t.change_null :country_code, false, "+1"
    end
  end
end
