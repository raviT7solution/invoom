# frozen_string_literal: true

class Types::RoleType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: false
  field :permissions, [String], null: false

  field :users, [Types::UserType], null: false
end
