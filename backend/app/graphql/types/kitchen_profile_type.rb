# frozen_string_literal: true

class Types::KitchenProfileType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: false
end
