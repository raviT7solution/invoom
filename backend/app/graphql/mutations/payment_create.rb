# frozen_string_literal: true

class Mutations::PaymentCreate < Mutations::BaseMutation
  argument :attributes, Types::PaymentAttributes, required: true
  argument :booking_id, ID, required: true

  type Boolean, null: false

  def resolve(booking_id:, attributes:) # rubocop:disable Metrics/AbcSize
    booking = BookingPolicy.new(context[:current_user]).scope.find(booking_id)

    if attributes[:mode] == "cash"
      ApplicationRecord.transaction do
        booking.booking_tables.update!(floor_object_id: nil)
        booking.update!(clocked_out_at: DateTime.current)
      end
    else
      raise_error "Invalid payment mode"
    end

    true
  rescue ActiveRecord::ActiveRecordError => e
    raise_error e.record.errors.full_messages.to_sentence

    false
  end
end
