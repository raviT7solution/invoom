# frozen_string_literal: true

class Mutations::BookingClockedOutAtUpdate < Mutations::BaseMutation
  argument :clocked_out, Boolean, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, clocked_out:)
    booking = BookingPolicy.new(context[:current_session]).scope.find(id)

    ApplicationRecord.transaction do
      if clocked_out
        booking.update!(clocked_out_at: Time.current)
      else
        booking.update!(clocked_out_at: nil)
      end
    end

    true
  rescue ActiveRecord::ActiveRecordError => e
    raise_error e.record.errors.full_messages.to_sentence
  end
end
