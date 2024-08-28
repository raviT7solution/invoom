# frozen_string_literal: true

class Mutations::ProductCreate < Mutations::BaseMutation
  argument :attributes, Types::ProductAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_user]).scope.find(restaurant_id)
    product = restaurant.products.new(available_quantity: 0, **attributes)

    raise_error product.errors.full_messages.to_sentence unless product.save

    true
  end
end
