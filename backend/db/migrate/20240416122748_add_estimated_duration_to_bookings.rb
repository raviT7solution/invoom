# frozen_string_literal: true

class AddEstimatedDurationToBookings < ActiveRecord::Migration[7.0]
  def change
    add_column :bookings, :estimated_duration, :string, null: true
  end
end
