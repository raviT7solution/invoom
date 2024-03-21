# frozen_string_literal: true

class Types::TimezoneType < Types::BaseObject
  field :identifier, String, null: false
  field :offset, Integer, null: false
end
