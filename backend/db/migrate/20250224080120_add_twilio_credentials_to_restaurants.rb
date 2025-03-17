# frozen_string_literal: true

class AddTwilioCredentialsToRestaurants < ActiveRecord::Migration[7.0]
  def change
    change_table :restaurants, bulk: true do |t|
      t.string :twilio_account_sid, null: true
      t.string :twilio_auth_token, null: true
      t.string :twilio_sms_phone_number, null: true
    end
  end
end
