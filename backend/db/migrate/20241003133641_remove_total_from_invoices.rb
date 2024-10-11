# frozen_string_literal: true

class RemoveTotalFromInvoices < ActiveRecord::Migration[7.0]
  def change
    change_table :invoices, bulk: true do |t|
      t.remove :total, type: :float
    end
  end
end
