# frozen_string_literal: true

class Types::CustomerType < Types::BaseObject
  field :email, String, null: true
  field :id, ID, null: false
  field :name, String, null: false
  field :phone_number, String, null: false
end
