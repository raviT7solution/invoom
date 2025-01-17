# frozen_string_literal: true

class Mutations::DeviceCreate < Mutations::BaseMutation
  argument :attributes, Types::DeviceAttributes, required: true
  argument :restaurant_id, ID, required: true

  type Boolean, null: false

  def resolve(restaurant_id:, attributes:)
    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)

    device = restaurant.devices.find_or_create_by(fingerprint: attributes[:fingerprint]) do |i|
      i.assign_attributes(**attributes)
    end

    raise_error device.errors.full_messages.to_sentence unless device.save

    true
  end
end
