# frozen_string_literal: true

class Mutations::DeviceCreate < Mutations::BaseMutation
  argument :attributes, Types::DeviceAttributes, required: true
  argument :restaurant_id, ID, required: true

  type ID, null: false

  def resolve(restaurant_id:, attributes:) # rubocop:disable Metrics/AbcSize
    session = context[:current_session]

    restaurant = RestaurantPolicy.new(context[:current_session]).scope.find(restaurant_id)

    device = restaurant.devices.find_or_initialize_by(fingerprint: attributes[:fingerprint]) do |i|
      i.assign_attributes(**attributes)
    end

    raise_error device.errors.full_messages.to_sentence unless device.save
    raise_error session.errors.full_messages.to_sentence unless session.update(device: device)

    device.id
  end
end
