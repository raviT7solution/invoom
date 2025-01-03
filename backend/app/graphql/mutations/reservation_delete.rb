# frozen_string_literal: true

class Mutations::ReservationDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    reservation = ReservationPolicy.new(context[:current_user]).scope.find(id)

    raise_error reservation.errors.full_messages.to_sentence unless reservation.destroy

    true
  end
end
