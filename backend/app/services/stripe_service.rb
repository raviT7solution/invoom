# frozen_string_literal: true

class StripeService
  attr_reader :restaurant

  def initialize(restaurant)
    @restaurant = restaurant
  end

  def connection_token_create
    Stripe::Terminal::ConnectionToken.create({}, **options)
  end

  def payment_intent_cancel(id)
    Stripe::PaymentIntent.cancel(id, {}, **options)
  end

  def payment_intent_create(amount:, description:)
    params = {
      amount: amount,
      capture_method: "automatic",
      currency: Country[restaurant.country].currency_code,
      description: description,
      payment_method_types: ["card_present", "interac_present"]
    }

    Stripe::PaymentIntent.create(params, **options)
  end

  def payment_intent_retrieve(id)
    Stripe::PaymentIntent.retrieve(id, **options)
  end

  def payment_method_retrieve(id)
    Stripe::PaymentMethod.retrieve(id, **options)
  end

  private

  def options
    if restaurant.stripe_account_type_connect?
      { api_key: ENV.fetch("STRIPE_API_KEY"), stripe_account: restaurant.stripe_account_id }
    elsif restaurant.stripe_account_type_own?
      { api_key: restaurant.payment_secret_key }
    else
      raise NotImplementedError
    end
  end
end
