# frozen_string_literal: true

class AddTableNameAndNoteInReservations < ActiveRecord::Migration[7.0]
  def change
    change_table :reservations, bulk: false do |t|
      t.rename :special_request, :note
      t.string :table_name, null: true
    end
  end
end
