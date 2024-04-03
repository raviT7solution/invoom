# frozen_string_literal: true

class Types::AdminSessionType < Types::BaseObject
  field :token, String, null: false
end
