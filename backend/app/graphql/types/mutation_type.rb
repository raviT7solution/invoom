# frozen_string_literal: true

class Types::MutationType < Types::BaseObject
  field :user_session_create, mutation: Mutations::User::SessionCreate, null: false
end
