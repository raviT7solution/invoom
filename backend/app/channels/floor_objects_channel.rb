# frozen_string_literal: true

class FloorObjectsChannel < ApplicationCable::Channel
  def subscribed
    session = Session.new(params["Authorization"])
    restaurant = RestaurantPolicy.new(session).scope.find(params["restaurant_id"])

    stream_for restaurant
  end
end
