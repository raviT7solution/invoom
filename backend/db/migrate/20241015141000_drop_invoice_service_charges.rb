# frozen_string_literal: true

class DropInvoiceServiceCharges < ActiveRecord::Migration[7.0]
  def change
    drop_table :invoice_service_charges do |t|
      t.references :invoice, null: false, foreign_key: true, type: :uuid
      t.references :service_charge, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
