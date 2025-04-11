# frozen_string_literal: true

class CreateReceiptConfigurations < ActiveRecord::Migration[7.0]
  def change
    create_table :receipt_configurations, id: :uuid do |t|
      t.boolean :show_customer_details, default: true, null: false
      t.boolean :show_discount, default: true, null: false
      t.boolean :show_platform_branding, default: true, null: false
      t.boolean :show_unit_price, default: true, null: false

      t.references :restaurant, foreign_key: true, null: false, type: :uuid, index: { unique: true }

      t.timestamps
    end
  end
end
