# frozen_string_literal: true

class Mutations::CategoryCreate < Mutations::BaseMutation
  argument :attributes, Types::CategoryAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)
    category = restaurant.categories.new(attributes.to_h)

    raise_error category.errors.full_messages.to_sentence unless category.save

    true
  end
end
