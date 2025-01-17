# frozen_string_literal: true

class Mutations::UserCreate < Mutations::BaseMutation
  argument :attributes, Types::UserAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(attributes:, restaurant_id:)
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)
    user = restaurant.users.new(attributes.to_h)

    raise_error user.errors.full_messages.to_sentence unless user.save

    true
  end
end
