# frozen_string_literal: true

class AddUomToTicketItems < ActiveRecord::Migration[7.0]
  def change
    change_table :ticket_items do |t|
      t.string :uom, null: true
      t.change_null :uom, false, "item"
    end
  end
end
