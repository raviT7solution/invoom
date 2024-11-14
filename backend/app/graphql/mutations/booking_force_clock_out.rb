# frozen_string_literal: true

class Mutations::BookingForceClockOut < Mutations::BaseMutation
  argument :booking_id, ID, required: true
  argument :pin, String, required: false

  type Boolean, null: false

  def resolve(booking_id:, pin: nil)
    booking = BookingPolicy.new(context[:current_user]).scope.find(booking_id)

    raise_error "Invalid pin" unless can_perform_delete?(booking, pin)

    raise_error booking.errors.full_messages.to_sentence unless booking.destroy

    true
  end

  private

  def can_perform_delete?(booking_id, pin)
    ticket_items = TicketItem.joins(:ticket).where(tickets: { booking_id: booking_id })
    restaurant = context[:current_user].mobile_user!.restaurant

    force_clock_out = BookingPolicy.new(context[:current_user]).force_clock_out?
    valid_pin = restaurant.authenticate_pin(pin)

    ticket_items.blank? || force_clock_out || valid_pin
  end
end
