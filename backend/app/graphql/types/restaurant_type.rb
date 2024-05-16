# frozen_string_literal: true

class Types::RestaurantType < Types::BaseObject
  field :address, String, null: true
  field :city, String, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :postal_code, String, null: false
  field :province, String, null: false
  field :timezone, String, null: false
end
