# frozen_string_literal: true

class AddCstAndPostalCodeToTaxes < ActiveRecord::Migration[7.0]
  def change
    change_table :taxes, bulk: true do |t|
      t.float :cst, null: true
      t.string :postal_code, null: true
    end

    change_column_null :taxes, :cst, false, 0
  end
end
