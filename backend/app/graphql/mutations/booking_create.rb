# frozen_string_literal: true

class Mutations::BookingCreate < Mutations::BaseMutation
  argument :attributes, Types::BookingAttributes, required: true
  argument :restaurant_id, ID, required: true

  type ID, null: false

  def resolve(attributes:, restaurant_id:) # rubocop:disable Metrics/AbcSize
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)

    if attributes[:customer_id].present?
      customer = CustomerPolicy.new(context[:current_session]).scope.find(attributes[:customer_id])
    end

    booking = Booking.new(
      booking_type: attributes[:booking_type],
      clocked_in_at: DateTime.current,
      customer: customer,
      estimated_duration: attributes[:estimated_duration],
      pax: attributes[:pax],
      restaurant: restaurant,
      table_names: attributes[:table_names],
      user: context[:current_session].mobile_user!
    )

    raise_error booking.errors.full_messages.to_sentence unless booking.save

    booking.id
  end
end
