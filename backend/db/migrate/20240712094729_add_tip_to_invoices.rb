# frozen_string_literal: true

class AddTipToInvoices < ActiveRecord::Migration[7.0]
  def change
    change_table :invoices, bulk: true do |t|
      t.float :tip, default: 0, null: false
    end
  end
end
