# frozen_string_literal: true

class Types::User::SessionType < Types::BaseObject
  field :token, String, null: false
end
