# frozen_string_literal: true

class CreateRestaurants < ActiveRecord::Migration[7.0]
  def change
    create_table :restaurants, id: :uuid do |t|
      t.string :name
      t.string :address
      t.string :pin_digest, null: true

      t.timestamps
    end
  end
end
