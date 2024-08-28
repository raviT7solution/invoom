# frozen_string_literal: true

class AddAvailableQuantityToProducts < ActiveRecord::Migration[7.0]
  def change
    change_table :products do |t|
      t.float :available_quantity, null: false
      t.change_null :description, true
    end
  end
end
