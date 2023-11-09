# frozen_string_literal: true

class Types::RestaurantType < Types::BaseObject
  field :address, String, null: true
  field :id, ID, null: false
  field :name, String, null: false
end
