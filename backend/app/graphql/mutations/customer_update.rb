# frozen_string_literal: true

class Mutations::CustomerUpdate < Mutations::BaseMutation
  argument :attributes, Types::CustomerAttributes, required: true
  argument :restaurant_id, ID, required: true

  type ID, null: false

  def resolve(attributes:, restaurant_id:)
    customer = CustomerPolicy.new(context[:current_session]).scope.find_or_initialize_by(
      phone_number: attributes[:phone_number], restaurant_id: restaurant_id
    )

    raise_error customer.errors.full_messages.to_sentence unless customer.update(attributes.to_h)

    customer.id
  end
end
