# frozen_string_literal: true

class CreateTicketItemAddons < ActiveRecord::Migration[7.0]
  def change
    create_table :ticket_item_addons, id: :uuid do |t|
      t.string :name, null: false
      t.float :price, null: false
      t.references :ticket_item, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
