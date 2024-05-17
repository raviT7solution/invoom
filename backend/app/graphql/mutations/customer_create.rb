# frozen_string_literal: true

class Mutations::CustomerCreate < Mutations::BaseMutation
  argument :attributes, Types::CustomerAttributes, required: true
  argument :restaurant_id, ID, required: true

  type ID, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_user]).scope.find(restaurant_id)
    customer = restaurant.customers.new(attributes.to_h)

    raise_error customer.errors.full_messages.to_sentence unless customer.save

    customer.id
  end
end
