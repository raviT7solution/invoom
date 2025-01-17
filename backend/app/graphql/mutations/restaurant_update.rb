# frozen_string_literal: true

class Mutations::RestaurantUpdate < Mutations::BaseMutation
  argument :attributes, Types::RestaurantAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(id)

    raise_error restaurant.errors.full_messages.to_sentence unless restaurant.update(**attributes)

    true
  end
end
