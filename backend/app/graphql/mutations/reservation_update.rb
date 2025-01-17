# frozen_string_literal: true

class Mutations::ReservationUpdate < Mutations::BaseMutation
  argument :attributes, Types::ReservationAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    reservation = ReservationPolicy.new(context[:current_session]).scope.find(id)

    raise_error reservation.errors.full_messages.to_sentence unless reservation.update(**attributes)

    true
  end
end
