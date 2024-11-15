# frozen_string_literal: true

class CreateBookingServiceCharges < ActiveRecord::Migration[7.0]
  def change
    create_table :booking_service_charges, id: :uuid do |t|
      t.float :cst, null: false
      t.float :gst, null: false
      t.float :hst, null: false
      t.float :pst, null: false
      t.float :qst, null: false
      t.float :rst, null: false
      t.float :value, null: false
      t.integer :charge_type, null: false
      t.string :name, null: false

      t.references :booking, null: false, foreign_key: true, type: :uuid
      t.references :service_charge, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
