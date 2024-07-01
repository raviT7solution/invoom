# frozen_string_literal: true

class AddNumberToBookings < ActiveRecord::Migration[7.0]
  def change
    change_table :bookings, bulk: true do |t|
      t.bigserial :number, null: false, index: { unique: true }
    end
  end
end
