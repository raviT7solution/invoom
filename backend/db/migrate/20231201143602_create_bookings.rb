# frozen_string_literal: true

class CreateBookings < ActiveRecord::Migration[7.0]
  def change
    create_table :bookings, id: :uuid do |t|
      t.datetime :clocked_in_at, null: false
      t.datetime :clocked_out_at, null: true
      t.integer :pax, null: true
      t.integer :booking_type, null: false

      t.references :customer, null: true, foreign_key: true, type: :uuid
      t.references :restaurant, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
