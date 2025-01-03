# frozen_string_literal: true

class AddAdultsAndKidsAndSpecialRequestToReservations < ActiveRecord::Migration[7.0]
  def change
    change_table :reservations, bulk: false do |t|
      t.rename :pax, :adults

      t.integer :kids, null: true
      t.string :special_request, null: true

      t.change_null :kids, false, 0
    end
  end
end
