# frozen_string_literal: true

class Types::AdminType < Types::BaseObject
  field :email, String, null: false
  field :first_name, String, null: false
  field :id, ID, null: false
  field :last_name, String, null: false

  field :restaurants, [Types::RestaurantType], null: false
end
