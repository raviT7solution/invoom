# frozen_string_literal: true

class Types::MutationType < Types::BaseObject
  field :admin_session_create, mutation: Mutations::Admin::SessionCreate, null: false
  field :category_create, mutation: Mutations::CategoryCreate, null: false, authorize: "CategoryPolicy#create?"
  field :category_delete, mutation: Mutations::CategoryDelete, null: false, authorize: "CategoryPolicy#delete?"
  field :category_update, mutation: Mutations::CategoryUpdate, null: false, authorize: "CategoryPolicy#update?"
  field :floor_object_update, mutation: Mutations::FloorObjectUpdate, null: false,
                              authorize: "FloorObjectPolicy#update?"
  field :menu_create, mutation: Mutations::MenuCreate, null: false, authorize: "MenuPolicy#create?"
  field :menu_delete, mutation: Mutations::MenuDelete, null: false, authorize: "MenuPolicy#delete?"
  field :menu_update, mutation: Mutations::MenuUpdate, null: false, authorize: "MenuPolicy#update?"
  field :role_create, mutation: Mutations::RoleCreate, null: false, authorize: "RolePolicy#create?"
  field :role_delete, mutation: Mutations::RoleDelete, null: false, authorize: "RolePolicy#update?"
  field :role_update, mutation: Mutations::RoleUpdate, null: false, authorize: "RolePolicy#delete?"
  field :user_create, mutation: Mutations::UserCreate, null: false, authorize: "UserPolicy#create?"
  field :user_delete, mutation: Mutations::UserDelete, null: false, authorize: "UserPolicy#delete?"
  field :user_update, mutation: Mutations::UserUpdate, null: false, authorize: "UserPolicy#update?"
end
