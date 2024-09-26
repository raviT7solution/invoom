# frozen_string_literal: true

class Mutations::PaymentDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    payment = PaymentPolicy.new(context[:current_user]).scope.where(payment_mode: "void").find(id)

    raise_error payment.errors.full_messages.to_sentence unless payment.destroy

    true
  end
end
