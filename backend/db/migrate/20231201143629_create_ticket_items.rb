# frozen_string_literal: true

class CreateTicketItems < ActiveRecord::Migration[7.0]
  def change
    create_table :ticket_items, id: :uuid do |t|
      t.string :display_name, null: false
      t.float :price, null: false
      t.integer :quantity, null: false
      t.integer :status, null: false
      t.string :modifiers, array: true, default: [], null: false
      t.string :name, null: false
      t.string :note, null: true

      t.references :ticket, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
