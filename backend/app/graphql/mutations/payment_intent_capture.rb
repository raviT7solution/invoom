# frozen_string_literal: true

class Mutations::PaymentIntentCapture < Mutations::BaseMutation
  argument :payment_intent_id, String, required: true

  field :status, String, null: false

  def resolve(payment_intent_id:)
    api_key = context[:current_user].mobile_user!.restaurant.payment_secret_key

    intent = Stripe::PaymentIntent.capture(payment_intent_id, {}, api_key: api_key)

    { status: intent.status }
  end
end
