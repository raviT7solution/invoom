# frozen_string_literal: true

class AddPaymentIntentIdToInvoices < ActiveRecord::Migration[7.0]
  def change
    change_table :invoices, bulk: true do |t|
      t.string :payment_intent_id, null: true
    end
  end
end
