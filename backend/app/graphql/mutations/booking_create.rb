# frozen_string_literal: true

class Mutations::BookingCreate < Mutations::BaseMutation
  argument :attributes, Types::BookingAttributes, required: true
  argument :restaurant_id, ID, required: true

  type ID, null: false

  def resolve(attributes:, restaurant_id:) # rubocop:disable Metrics/AbcSize
    restaurant = RestaurantPolicy.new(context[:current_user]).scope.find(restaurant_id)

    if attributes[:customer_id].present?
      customer = CustomerPolicy.new(context[:current_user]).scope.find(attributes[:customer_id])
    end

    booking = Booking.new(
      booking_type: attributes[:booking_type],
      clocked_in_at: DateTime.current,
      customer: customer,
      pax: attributes[:pax],
      restaurant: restaurant,
      user: context[:current_user].mobile_user!
    )

    tables = FloorObjectPolicy.new(context[:current_user]).scope.object_type_table
                              .find(attributes[:floor_object_ids] || [])

    tables.each do |t|
      raise_error "#{t.name} is already booked" if t.booking_table.present?

      booking.booking_tables.build(name: t.name, floor_object: t)
    end

    raise_error booking.errors.full_messages.to_sentence unless booking.save

    booking.id
  end
end
