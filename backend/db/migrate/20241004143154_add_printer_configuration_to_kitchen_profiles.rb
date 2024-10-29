# frozen_string_literal: true

class AddPrinterConfigurationToKitchenProfiles < ActiveRecord::Migration[7.0]
  def change
    change_table :kitchen_profiles, bulk: true do |t|
      t.references :printer_configuration, null: true, foreign_key: true, type: :uuid
    end
  end
end
