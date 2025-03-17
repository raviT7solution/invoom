# frozen_string_literal: true

class TwilioService
  attr_reader :restaurant

  def initialize(restaurant)
    @restaurant = restaurant
  end

  def message_create(body:, to:)
    response = client.messages.create(
      body: body,
      from: restaurant.twilio_sms_phone_number,
      to: to
    )

    response.status
  end

  private

  def client
    @client ||= Twilio::REST::Client.new(restaurant.twilio_account_sid, restaurant.twilio_auth_token)
  end
end
