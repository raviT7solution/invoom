# frozen_string_literal: true

class RemoveCountryCodeFromUsersAndCustomers < ActiveRecord::Migration[7.0]
  def change
    remove_column :users, :country_code, :string
    remove_column :customers, :country_code, :string
  end
end
