# frozen_string_literal: true

class TicketItemsChannel < ApplicationCable::Channel
  def subscribed
    session = Session.find_signed!(params["Authorization"])
    booking = BookingPolicy.new(session).scope.find(params["booking_id"])

    stream_for booking
  end
end
