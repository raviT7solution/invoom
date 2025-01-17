# frozen_string_literal: true

class Mutations::PaymentUpdate < Mutations::BaseMutation
  argument :attributes, Types::PaymentAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    payment = PaymentPolicy.new(context[:current_session]).scope.find(id)

    raise_error payment.errors.full_messages.to_sentence unless payment.update(**attributes)

    true
  end
end
