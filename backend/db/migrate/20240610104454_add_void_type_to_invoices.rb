# frozen_string_literal: true

class AddVoidTypeToInvoices < ActiveRecord::Migration[7.0]
  def change
    change_table :invoices, bulk: true do |t|
      t.integer :void_type, null: true
    end
  end
end
