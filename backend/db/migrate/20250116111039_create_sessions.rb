# frozen_string_literal: true

class CreateSessions < ActiveRecord::Migration[7.0]
  def change
    create_table :sessions, id: :uuid do |t|
      t.references :sessionable, polymorphic: true, null: false, type: :uuid
      t.string :subject, null: false

      t.references :device, foreign_key: true, null: true, type: :uuid

      t.timestamps
    end
  end
end
