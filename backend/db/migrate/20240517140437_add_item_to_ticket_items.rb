# frozen_string_literal: true

class AddItemToTicketItems < ActiveRecord::Migration[7.0]
  def change
    change_table :ticket_items, bulk: true do |t|
      t.references :item, null: false, foreign_key: true, type: :uuid
    end
  end
end
