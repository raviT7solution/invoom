# frozen_string_literal: true

class DropBookingTables < ActiveRecord::Migration[7.0]
  def change
    drop_table :booking_tables, id: :uuid do |t|
      t.string :name, null: false

      t.references :booking, null: false, foreign_key: true, type: :uuid
      t.references :floor_object, null: true, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
