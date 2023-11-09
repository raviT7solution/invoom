# frozen_string_literal: true

class Mutations::RoleCreate < Mutations::BaseMutation
  argument :attributes, Types::RoleAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Types::RoleType, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_user]).scope.find(restaurant_id)
    role = restaurant.roles.new(attributes.to_h)

    if role.save
      role
    else
      raise_error role.errors.full_messages.to_sentence
    end
  end
end
