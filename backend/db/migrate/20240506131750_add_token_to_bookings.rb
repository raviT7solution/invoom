# frozen_string_literal: true

class AddTokenToBookings < ActiveRecord::Migration[7.0]
  def change
    add_column :bookings, :token, :integer, null: true
  end
end
