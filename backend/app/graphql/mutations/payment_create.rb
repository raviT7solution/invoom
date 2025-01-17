# frozen_string_literal: true

class Mutations::PaymentCreate < Mutations::BaseMutation
  argument :attributes, Types::PaymentAttributes, required: true
  argument :invoice_id, ID, required: true

  type Boolean, null: false

  def resolve(attributes:, invoice_id:) # rubocop:disable Metrics/AbcSize
    invoice = InvoicePolicy.new(context[:current_session]).scope.find(invoice_id)

    if invoice.payments.exists?(payment_mode: "void")
      raise_error "Void payment is present, you can't create a new payment"
    end

    case attributes[:payment_mode]
    when "card"
      if attributes[:payment_intent_id].present?
        create_stripe_card_payment(invoice, attributes)
      else
        create_payment(invoice, attributes)
      end
    when "void"
      create_void_payment(invoice, attributes)
    when "cash", "uber_eats", "door_dash", "skip_the_dishes", "gift_card", "cheque"
      create_payment(invoice, attributes)
    else
      raise_error "Invalid payment mode"
    end

    true
  rescue ActiveRecord::ActiveRecordError => e
    raise_error e.record.errors.full_messages.to_sentence
  end

  private

  def create_payment(invoice, attributes)
    Payment.create!(
      amount: attributes[:amount] || 0,
      invoice: invoice,
      payment_mode: attributes[:payment_mode],
      tip: attributes[:tip] || 0,
      void_type: attributes[:void_type]
    )
  end

  def create_stripe_card_payment(invoice, attributes) # rubocop:disable Metrics/AbcSize
    restaurant = context[:current_session].mobile_user!.restaurant
    service = StripeService.new(restaurant)

    payment_intent = service.payment_intent_retrieve(attributes[:payment_intent_id]).as_json
    payment_method = service.payment_method_retrieve(payment_intent["payment_method"])

    card_details = payment_method.public_send(payment_method.type).as_json

    amount_received = payment_intent["amount_received"].to_f / 100
    tip = payment_intent.dig("amount_details", "tip", "amount").to_f / 100

    Payment.create!(
      amount: amount_received - tip,
      brand: card_details["brand"],
      card_number: card_details["last4"],
      funding: card_details["funding"],
      invoice: invoice,
      issuer: card_details["issuer"],
      payment_intent_id: attributes[:payment_intent_id],
      payment_mode: attributes[:payment_mode],
      tip: tip,
      void_type: attributes[:void_type]
    )
  end

  def create_void_payment(invoice, attributes)
    invoice.payments.update!(amount: 0, tip: 0)

    create_payment(invoice, attributes)
  end
end
