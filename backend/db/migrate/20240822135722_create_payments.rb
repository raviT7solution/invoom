# frozen_string_literal: true

class CreatePayments < ActiveRecord::Migration[7.0]
  def change
    create_table :payments, id: :uuid do |t|
      t.float :amount, null: false
      t.float :tip, null: false
      t.integer :payment_mode, null: false
      t.integer :void_type, null: true
      t.string :brand, null: true
      t.string :card_number, null: true
      t.string :funding, null: true
      t.string :issuer, null: true
      t.string :payment_intent_id, null: true

      t.references :invoice, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
