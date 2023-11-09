# frozen_string_literal: true

class Types::MutationType < Types::BaseObject
  field :admin_session_create, mutation: Mutations::Admin::SessionCreate, null: false
  field :role_create, mutation: Mutations::RoleCreate, null: false, authorize: "RolePolicy#create?"
  field :role_delete, mutation: Mutations::RoleDelete, null: false, authorize: "RolePolicy#update?"
  field :role_update, mutation: Mutations::RoleUpdate, null: false, authorize: "RolePolicy#delete?"
  field :user_create, mutation: Mutations::UserCreate, null: false, authorize: "UserPolicy#create?"
  field :user_delete, mutation: Mutations::UserDelete, null: false, authorize: "UserPolicy#delete?"
  field :user_update, mutation: Mutations::UserUpdate, null: false, authorize: "UserPolicy#update?"
end
