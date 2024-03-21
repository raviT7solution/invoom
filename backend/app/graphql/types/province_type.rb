# frozen_string_literal: true

class Types::ProvinceType < Types::BaseObject
  field :code, String, null: false
  field :name, String, null: false
end
