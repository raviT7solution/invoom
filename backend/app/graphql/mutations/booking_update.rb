# frozen_string_literal: true

class Mutations::BookingUpdate < Mutations::BaseMutation
  argument :attributes, Types::BookingAttributes, required: true
  argument :id, ID, required: true

  type ID, null: false

  def resolve(attributes:, id:)
    booking = BookingPolicy.new(context[:current_user]).scope.find(id)

    raise_error booking.errors.full_messages.to_sentence unless booking.update(attributes.to_h)

    true
  end
end
