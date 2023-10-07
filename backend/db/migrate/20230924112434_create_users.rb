# frozen_string_literal: true

class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users, id: :uuid do |t|
      t.date :end_date
      t.date :start_date, null: false
      t.float :wage, null: false
      t.integer :gender
      t.string :address
      t.string :city
      t.string :email, null: false, index: { unique: true }
      t.string :first_name, null: false
      t.string :last_name, null: false
      t.string :password_digest
      t.string :phone_number, null: false
      t.string :pin_digest
      t.string :username, null: false, index: { unique: true }
      t.string :zip_code

      t.timestamps
    end
  end
end
