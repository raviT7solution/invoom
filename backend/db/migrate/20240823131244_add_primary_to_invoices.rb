# frozen_string_literal: true

class AddPrimaryToInvoices < ActiveRecord::Migration[7.0]
  def change
    change_table :invoices, bulk: true do |t|
      t.boolean :primary, null: false, default: false
    end
  end
end
