# frozen_string_literal: true

class TicketItemsChannel < ApplicationCable::Channel
  def subscribed
    session = Session.new(params["Authorization"])
    kitchen_profile = KitchenProfilePolicy.new(session).scope.find_by(id: params[:kitchen_profile_id])

    return reject unless kitchen_profile

    stream_for kitchen_profile
  end
end
