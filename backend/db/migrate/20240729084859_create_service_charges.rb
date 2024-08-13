# frozen_string_literal: true

class CreateServiceCharges < ActiveRecord::Migration[7.0]
  def change
    create_table :service_charges, id: :uuid do |t|
      t.string :name, null: false
      t.integer :charge_type, null: false
      t.float :value, null: false
      t.boolean :visible, default: false, null: false

      t.references :restaurant, null: false, foreign_key: true, type: :uuid
      t.references :tax, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
