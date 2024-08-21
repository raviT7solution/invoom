# frozen_string_literal: true

class AddServiceChargeToInvoiceServiceCharges < ActiveRecord::Migration[7.0]
  def change
    change_table :invoice_service_charges, bulk: true do |t|
      t.references :service_charge, null: false, foreign_key: true, type: :uuid
    end
  end
end
