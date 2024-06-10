# frozen_string_literal: true

class CreateReservations < ActiveRecord::Migration[7.0]
  def change
    create_table :reservations, id: :uuid do |t|
      t.integer :status, null: false
      t.integer :pax, null: false
      t.datetime :reservation_at, null: false

      t.references :customer, null: false, foreign_key: true, type: :uuid
      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
