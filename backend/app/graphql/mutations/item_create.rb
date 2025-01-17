# frozen_string_literal: true

class Mutations::ItemCreate < Mutations::BaseMutation
  argument :attributes, Types::ItemAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)
    item = restaurant.items.new(attributes.to_h)

    raise_error item.errors.full_messages.to_sentence unless item.save

    true
  end
end
