# frozen_string_literal: true

class Mutations::BookingClose < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    booking = BookingPolicy.new(context[:current_session]).scope.find(id)

    ApplicationRecord.transaction do
      booking.booking_tables.update!(floor_object_id: nil)
      booking.update!(clocked_out_at: DateTime.current)
    end

    true
  rescue ActiveRecord::ActiveRecordError => e
    raise_error e.record.errors.full_messages.to_sentence

    false
  end
end
