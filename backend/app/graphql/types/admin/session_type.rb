# frozen_string_literal: true

class Types::Admin::SessionType < Types::BaseObject
  field :token, String, null: false
end
