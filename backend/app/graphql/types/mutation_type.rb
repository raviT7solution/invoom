# frozen_string_literal: true

class Types::MutationType < Types::BaseObject
  field :admin_session_create, mutation: Mutations::Admin::SessionCreate, null: false
end
