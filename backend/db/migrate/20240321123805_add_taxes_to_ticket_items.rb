# frozen_string_literal: true

class AddTaxesToTicketItems < ActiveRecord::Migration[7.0]
  def change
    change_table :ticket_items, bulk: true do |t|
      t.float :gst, null: false
      t.float :hst, null: false
      t.float :pst, null: false
      t.float :qst, null: false
      t.float :rst, null: false
    end
  end
end
