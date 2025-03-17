# frozen_string_literal: true

class Mutations::BookingForceUnlock < Mutations::BaseMutation
  argument :booking_id, ID, required: true

  type Boolean, null: false

  def resolve(booking_id:)
    booking = BookingPolicy.new(context[:current_session]).scope.find(booking_id)

    booking.update!(active_user_full_name: nil)

    true
  end
end
