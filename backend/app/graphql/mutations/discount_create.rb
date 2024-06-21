# frozen_string_literal: true

class Mutations::DiscountCreate < Mutations::BaseMutation
  argument :attributes, Types::DiscountAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_user]).scope.find(restaurant_id)
    discount = restaurant.discounts.new(attributes.to_h)

    raise_error discount.errors.full_messages.to_sentence unless discount.save

    true
  end
end
