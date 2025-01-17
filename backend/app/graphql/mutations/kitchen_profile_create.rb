# frozen_string_literal: true

class Mutations::KitchenProfileCreate < Mutations::BaseMutation
  argument :attributes, Types::KitchenProfileAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)
    kitchen_profile = restaurant.kitchen_profiles.new(attributes.to_h)

    raise_error kitchen_profile.errors.full_messages.to_sentence unless kitchen_profile.save

    true
  end
end
