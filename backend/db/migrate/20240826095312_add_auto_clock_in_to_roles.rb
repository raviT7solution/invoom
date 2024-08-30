# frozen_string_literal: true

class AddAutoClockInToRoles < ActiveRecord::Migration[7.0]
  def change
    change_table :roles, bulk: true do |t|
      t.boolean :auto_clock_in, null: false, default: true
    end
  end
end
