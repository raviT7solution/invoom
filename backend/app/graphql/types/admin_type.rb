# frozen_string_literal: true

class Types::AdminType < Types::BaseObject
  field :email, String, null: false
  field :full_name, String, null: false
  field :id, ID, null: false
end
