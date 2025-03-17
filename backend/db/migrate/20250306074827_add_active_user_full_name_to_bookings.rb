# frozen_string_literal: true

class AddActiveUserFullNameToBookings < ActiveRecord::Migration[7.0]
  def change
    change_table :bookings do |t|
      t.string :active_user_full_name, null: true
    end
  end
end
