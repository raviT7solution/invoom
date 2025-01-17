# frozen_string_literal: true

class Mutations::PaymentIntentCreate < Mutations::BaseMutation
  argument :amount, Float, required: true
  argument :invoice_id, ID, required: true

  field :client_secret, String, null: false

  def resolve(amount:, invoice_id:)
    restaurant = context[:current_session].mobile_user!.restaurant

    invoice = InvoicePolicy.new(context[:current_session]).scope.find(invoice_id)

    intent = StripeService.new(restaurant).payment_intent_create(
      amount: Integer(amount * 100),
      description: "Invoice ##{invoice.number}"
    )

    { client_secret: intent.client_secret }
  end
end
