# frozen_string_literal: true

class AddTableNamesToBookings < ActiveRecord::Migration[7.0]
  def change
    change_table :bookings, bulk: true do |t|
      t.string :table_names, array: true, null: true
    end
  end
end
