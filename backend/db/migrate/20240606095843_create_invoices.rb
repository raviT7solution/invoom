# frozen_string_literal: true

class CreateInvoices < ActiveRecord::Migration[7.0]
  def change
    create_table :invoices, id: :uuid do |t|
      t.bigserial :number, null: false, index: { unique: true }
      t.float :total, null: false
      t.integer :payment_mode, null: true
      t.integer :status, null: false
      t.integer :invoice_type, null: false

      t.references :booking, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
