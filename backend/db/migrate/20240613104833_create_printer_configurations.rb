# frozen_string_literal: true

class CreatePrinterConfigurations < ActiveRecord::Migration[7.0]
  def change
    create_table :printer_configurations, id: :uuid do |t|
      t.string :ip_address, null: false
      t.string :name, null: false
      t.string :port, null: false
      t.boolean :visible, default: true, null: false

      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps
      t.index [:name, :restaurant_id], unique: true
    end
  end
end
