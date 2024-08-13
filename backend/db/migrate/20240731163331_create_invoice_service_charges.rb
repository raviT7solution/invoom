# frozen_string_literal: true

class CreateInvoiceServiceCharges < ActiveRecord::Migration[7.0]
  def change
    create_table :invoice_service_charges, id: :uuid do |t|
      t.string :name, null: false
      t.integer :charge_type, null: false
      t.float :value, null: false
      t.float :gst, null: false
      t.float :hst, null: false
      t.float :pst, null: false
      t.float :qst, null: false
      t.float :rst, null: false
      t.float :cst, null: false

      t.references :invoice, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
