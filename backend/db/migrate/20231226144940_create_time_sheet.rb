# frozen_string_literal: true

class CreateTimeSheet < ActiveRecord::Migration[7.0]
  def change
    create_table :time_sheets, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.datetime :start_time, null: false
      t.datetime :end_time

      t.timestamps
    end
  end
end
