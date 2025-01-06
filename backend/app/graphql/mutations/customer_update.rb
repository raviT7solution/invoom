# frozen_string_literal: true

class Mutations::CustomerUpdate < Mutations::BaseMutation
  argument :attributes, Types::CustomerAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    customer = CustomerPolicy.new(context[:current_user]).scope.find(id)

    raise_error customer.errors.full_messages.to_sentence unless customer.update(attributes.to_h)

    true
  end
end
