# frozen_string_literal: true

class Mutations::PaymentIntentCreate < Mutations::BaseMutation
  argument :amount, Float, required: true

  field :client_secret, String, null: false

  def resolve(amount:)
    restaurant = context[:current_user].mobile_user!.restaurant
    api_key = restaurant.payment_secret_key

    intent = Stripe::PaymentIntent.create(
      {
        amount: Integer(amount * 100),
        currency: Country[restaurant.country].currency_code,
        payment_method_types: ["card_present"],
        capture_method: "manual"
      },
      api_key: api_key
    )

    { client_secret: intent.client_secret }
  end
end
