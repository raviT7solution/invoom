# frozen_string_literal: true

class Mutations::BookingForceClockOut < Mutations::BaseMutation
  argument :booking_id, ID, required: true

  type Boolean, null: false

  def resolve(booking_id:)
    booking = BookingPolicy.new(context[:current_user]).scope.find(booking_id)

    raise_error booking.errors.full_messages.to_sentence unless booking.destroy

    true
  end
end
