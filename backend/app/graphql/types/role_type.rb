# frozen_string_literal: true

class Types::RoleType < Types::BaseObject
  field :auto_clock_in, Boolean, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :permissions, [String], null: false

  field :users, [Types::UserType], scope: "UserPolicy", preload: :users, null: false
end
