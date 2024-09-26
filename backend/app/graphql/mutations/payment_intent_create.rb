# frozen_string_literal: true

class Mutations::PaymentIntentCreate < Mutations::BaseMutation
  argument :amount, Float, required: true
  argument :invoice_id, ID, required: true

  field :client_secret, String, null: false

  def resolve(amount:, invoice_id:) # rubocop:disable Metrics/AbcSize
    restaurant = context[:current_user].mobile_user!.restaurant
    api_key = restaurant.payment_secret_key

    invoice = InvoicePolicy.new(context[:current_user]).scope.find(invoice_id)

    intent = Stripe::PaymentIntent.create(
      {
        amount: Integer(amount * 100),
        capture_method: "automatic",
        currency: Country[restaurant.country].currency_code,
        description: "Invoice ##{invoice.number}",
        payment_method_types: ["card_present", "interac_present"]
      },
      api_key: api_key
    )

    { client_secret: intent.client_secret }
  end
end
