# frozen_string_literal: true

class Mutations::PaymentIntentCancel < Mutations::BaseMutation
  argument :payment_intent_id, String, required: true

  type Boolean, null: false

  def resolve(payment_intent_id:)
    restaurant = context[:current_user].mobile_user!.restaurant

    StripeService.new(restaurant).payment_intent_cancel(payment_intent_id)

    true
  end
end
