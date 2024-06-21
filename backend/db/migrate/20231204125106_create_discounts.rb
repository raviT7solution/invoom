# frozen_string_literal: true

class CreateDiscounts < ActiveRecord::Migration[7.0]
  def change # rubocop:disable Metrics/AbcSize
    create_table :discounts, id: :uuid do |t|
      t.boolean :auto_apply, default: false, null: false
      t.boolean :clubbed, default: false, null: false
      t.boolean :visible, default: true, null: false
      t.date :black_out_dates, array: true, null: false
      t.datetime :end_date_time
      t.datetime :start_date_time
      t.float :capping, null: false
      t.float :threshold, null: false
      t.float :value, null: false
      t.integer :discount_on, null: false
      t.integer :discount_type, null: false
      t.string :channels, array: true, null: false
      t.string :name, null: false
      t.string :repeat, array: true, null: false

      t.references :restaurant, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
