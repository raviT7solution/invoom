# frozen_string_literal: true

class AddUomToItems < ActiveRecord::Migration[7.0]
  def change
    change_table :items do |t|
      t.string :uom, null: true
      t.change_null :uom, false, "item"
    end
  end
end
