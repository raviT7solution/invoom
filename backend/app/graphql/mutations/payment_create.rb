# frozen_string_literal: true

class Mutations::PaymentCreate < Mutations::BaseMutation
  argument :attributes, Types::PaymentAttributes, required: true
  argument :invoice_id, ID, required: true

  type Boolean, null: false

  def resolve(attributes:, invoice_id:) # rubocop:disable Metrics/AbcSize
    invoice = InvoicePolicy.new(context[:current_user]).scope.find(invoice_id)

    case attributes[:mode]
    when "cash"
      update_invoice_with_cash(invoice, attributes)
    when "card"
      if invoice.payment_intent_id.present?
        update_invoice_with_card(invoice, attributes)
      else
        update_invoice_with_delivery_partner(invoice, attributes)
      end
    when "void"
      update_invoice_with_void(invoice, attributes)
    when "uber_eats", "door_dash", "skip_the_dishes"
      update_invoice_with_delivery_partner(invoice, attributes)
    else
      raise_error "Invalid payment mode"
    end

    true
  rescue ActiveRecord::ActiveRecordError => e
    raise_error e.record.errors.full_messages.to_sentence
  end

  private

  def update_invoice_with_card(invoice, attributes) # rubocop:disable Metrics/AbcSize
    api_key = context[:current_user].mobile_user!.restaurant.payment_secret_key

    payment_intent = Stripe::PaymentIntent.retrieve(invoice.payment_intent_id, api_key: api_key)
    payment_method = Stripe::PaymentMethod.retrieve(payment_intent.payment_method, api_key: api_key)

    card_details = payment_method.public_send(payment_method.type).as_json

    invoice.update!(
      amount_received: payment_intent.amount_received.to_f / 100,
      brand: card_details["brand"],
      card_number: card_details["last4"],
      funding: card_details["funding"],
      issuer: card_details["issuer"],
      payment_mode: attributes[:mode],
      status: "paid",
      tip: payment_intent.amount_details&.tip&.amount.to_f / 100
    )
  end

  def update_invoice_with_cash(invoice, attributes)
    invoice.update!(payment_mode: attributes[:mode], status: "paid", tip: attributes[:tip] || 0)
  end

  def update_invoice_with_delivery_partner(invoice, attributes)
    invoice.update!(payment_mode: attributes[:mode], status: "paid")
  end

  def update_invoice_with_void(invoice, attributes)
    invoice.update!(payment_mode: attributes[:mode], void_type: attributes[:void_type])
  end
end
