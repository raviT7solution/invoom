# frozen_string_literal: true

class AddCstToTicketItems < ActiveRecord::Migration[7.0]
  def change
    change_table :ticket_items, bulk: true do |t|
      t.float :cst, null: true
    end

    change_column_null :ticket_items, :cst, false, 0
  end
end
