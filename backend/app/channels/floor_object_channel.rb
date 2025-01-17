# frozen_string_literal: true

class FloorObjectChannel < ApplicationCable::Channel
  def subscribed # rubocop:disable Metrics/AbcSize
    session = Session.find_signed!(params["Authorization"])
    restaurant = RestaurantPolicy.new(session).scope.find(params["restaurant_id"])
    floor_object = FloorObjectPolicy.new(session).scope.find(params["floor_object_id"])

    floor_object.update!(active_user_full_name: session.mobile_user!.full_name)

    stream_for floor_object

    FloorObjectsChannel.broadcast_to(restaurant, {})
  end

  def unsubscribed
    floor_object = FloorObject.find(params["floor_object_id"])

    floor_object.update!(active_user_full_name: nil)

    FloorObjectsChannel.broadcast_to(floor_object.restaurant, {})
  end
end
