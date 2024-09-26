# frozen_string_literal: true

class RemovePaymentFieldsFromInvoices < ActiveRecord::Migration[7.0]
  def change
    change_table :invoices, bulk: true do |t|
      t.remove :amount_received, type: :string
      t.remove :brand, type: :string
      t.remove :card_number, type: :string
      t.remove :funding, type: :string
      t.remove :issuer, type: :string
      t.remove :payment_intent_id, type: :string
      t.remove :payment_mode, type: :integer
      t.remove :status, type: :integer
      t.remove :tip, type: :float
      t.remove :void_type, type: :integer
    end
  end
end
