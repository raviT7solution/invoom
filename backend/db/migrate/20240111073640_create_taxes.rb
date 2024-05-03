# frozen_string_literal: true

class CreateTaxes < ActiveRecord::Migration[7.0]
  def change
    create_table :taxes, id: :uuid do |t|
      t.string :display_name, null: false
      t.string :province, null: false
      t.string :country, null: false
      t.integer :category, null: false
      t.float :gst, null: false
      t.float :hst, null: false
      t.float :qst, null: false
      t.float :rst, null: false
      t.float :pst, null: false

      t.timestamps
    end
  end
end
