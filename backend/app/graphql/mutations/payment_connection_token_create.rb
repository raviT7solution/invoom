# frozen_string_literal: true

class Mutations::PaymentConnectionTokenCreate < Mutations::BaseMutation
  type String, null: false

  def resolve
    api_key = context[:current_user].mobile_user!.restaurant.payment_secret_key

    connection_token = Stripe::Terminal::ConnectionToken.create({}, api_key: api_key)

    connection_token.secret
  end
end
