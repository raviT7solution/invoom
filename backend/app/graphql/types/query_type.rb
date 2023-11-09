# frozen_string_literal: true

class Types::QueryType < Types::BaseObject
  field :current_admin, Types::AdminType, null: false, authorize: "AdminPolicy#show?"
  field :role, Types::RoleType, null: false, authorize: "RolePolicy#show?" do
    argument :id, ID, required: true
  end
  field :roles, [Types::RoleType], null: false, authorize: "RolePolicy#index?" do
    argument :restaurant_id, ID, required: true
  end
  field :user, Types::UserType, null: false, authorize: "UserPolicy#show?" do
    argument :id, ID, required: true
  end

  def current_admin
    context[:current_user]
  end

  def role(id:)
    RolePolicy.new(context[:current_user]).scope.find(id)
  end

  def roles(restaurant_id:)
    RolePolicy.new(context[:current_user]).scope.joins(:restaurant).where(restaurant: { id: restaurant_id })
  end

  def user(id:)
    UserPolicy.new(context[:current_user]).scope.find(id)
  end
end
