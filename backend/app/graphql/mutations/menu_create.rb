# frozen_string_literal: true

class Mutations::MenuCreate < Mutations::BaseMutation
  argument :attributes, Types::MenuAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_user]).scope.find(restaurant_id)
    menu = restaurant.menus.new(attributes.to_h)

    raise_error menu.errors.full_messages.to_sentence unless menu.save

    true
  end
end
