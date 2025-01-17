# frozen_string_literal: true

class Mutations::PaymentConnectionTokenCreate < Mutations::BaseMutation
  type String, null: false

  def resolve
    restaurant = context[:current_session].mobile_user!.restaurant

    connection_token = StripeService.new(restaurant).connection_token_create

    connection_token.secret
  end
end
