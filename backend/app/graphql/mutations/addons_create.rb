# frozen_string_literal: true

class Mutations::AddonsCreate < Mutations::BaseMutation
  argument :attributes, Types::AddonsAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)
    addon = restaurant.addons.new(attributes.to_h)

    raise_error addon.errors.full_messages.to_sentence unless addon.save

    true
  end
end
