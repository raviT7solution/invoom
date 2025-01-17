# frozen_string_literal: true

class Mutations::ModifierCreate < Mutations::BaseMutation
  argument :attributes, Types::ModifierAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)
    modifier = restaurant.modifiers.new(attributes.to_h)

    raise_error modifier.errors.full_messages.to_sentence unless modifier.save

    true
  end
end
