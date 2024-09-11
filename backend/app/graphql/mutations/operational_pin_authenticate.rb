# frozen_string_literal: true

class Mutations::OperationalPinAuthenticate < Mutations::BaseMutation
  argument :pin, String, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, pin:)
    restaurant = RestaurantPolicy.new(context[:current_user]).scope.find(restaurant_id)

    raise_error "Invalid pin" unless restaurant.authenticate_pin(pin)

    true
  end
end
