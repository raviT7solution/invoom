# frozen_string_literal: true

class Mutations::PaymentIntentCancel < Mutations::BaseMutation
  argument :payment_intent_id, String, required: true

  type Boolean, null: false

  def resolve(payment_intent_id:)
    api_key = context[:current_user].mobile_user!.restaurant.payment_secret_key

    Stripe::PaymentIntent.cancel(payment_intent_id, {}, api_key: api_key)

    true
  end
end
