# frozen_string_literal: true

class BookingChannel < ApplicationCable::Channel
  def subscribed
    session = Session.find_signed!(params["Authorization"])
    booking = BookingPolicy.new(session).scope.find(params["booking_id"])

    booking.update!(active_user_full_name: session.mobile_user!.full_name)

    stream_for booking
  end

  def unsubscribed
    booking = Booking.find(params["booking_id"])

    booking.update!(active_user_full_name: nil)
  end
end
