# frozen_string_literal: true

class AddActiveUserFullNameToFloorObjects < ActiveRecord::Migration[7.0]
  change_table :floor_objects, bulk: true do |t|
    t.string :active_user_full_name, null: true
  end
end
