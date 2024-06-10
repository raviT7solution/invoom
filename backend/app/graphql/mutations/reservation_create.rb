# frozen_string_literal: true

class Mutations::ReservationCreate < Mutations::BaseMutation
  argument :attributes, Types::ReservationAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_user]).scope.find(restaurant_id)
    reservation = restaurant.reservations.new(attributes.to_h)

    raise_error reservation.errors.full_messages.to_sentence unless reservation.save

    true
  end
end
