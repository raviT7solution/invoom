# frozen_string_literal: true

class AddPhoneNumberIndexToCustomers < ActiveRecord::Migration[7.0]
  def change
    change_table :customers, bulk: true do |t|
      t.remove_index [:email, :restaurant_id]
      t.index [:phone_number, :restaurant_id], unique: true
    end
  end
end
