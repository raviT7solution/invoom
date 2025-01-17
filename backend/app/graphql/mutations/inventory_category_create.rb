# frozen_string_literal: true

class Mutations::InventoryCategoryCreate < Mutations::BaseMutation
  argument :attributes, Types::InventoryCategoryAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)

    inventory_category = restaurant.inventory_categories.new(attributes.to_h)

    raise_error inventory_category.errors.full_messages.to_sentence unless inventory_category.save

    true
  end
end
