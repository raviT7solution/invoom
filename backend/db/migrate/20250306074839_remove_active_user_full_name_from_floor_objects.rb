# frozen_string_literal: true

class RemoveActiveUserFullNameFromFloorObjects < ActiveRecord::Migration[7.0]
  def change
    change_table :floor_objects, bulk: true do |t|
      t.remove :active_user_full_name, type: :string
    end
  end
end
