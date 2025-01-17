# frozen_string_literal: true

class Types::DeviceType < Types::BaseObject
  field :fingerprint, String, null: false
  field :id, ID, null: false
  field :name, String, null: false
end
