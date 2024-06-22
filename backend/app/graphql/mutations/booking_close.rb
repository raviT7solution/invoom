# frozen_string_literal: true

class Mutations::BookingClose < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    booking = BookingPolicy.new(context[:current_user]).scope.find(id)

    if booking.tickets.joins(:ticket_items).where.not(ticket_items: { status: :cancelled }).exists?
      raise_error "Item(s) still present in kitchen"
    end

    ApplicationRecord.transaction do
      booking.booking_tables.update!(floor_object_id: nil)
      booking.update!(clocked_out_at: DateTime.current)
    end

    true
  end
end
