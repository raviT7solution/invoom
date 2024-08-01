# frozen_string_literal: true

class AddFieldsToInvoices < ActiveRecord::Migration[7.0]
  def change
    change_table :invoices, bulk: true do |t|
      t.string :amount_received, null: true
      t.string :brand, null: true
      t.string :card_number, null: true
      t.string :funding, null: true
      t.string :issuer, null: true
    end
  end
end
