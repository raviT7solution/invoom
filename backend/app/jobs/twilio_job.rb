# frozen_string_literal: true

class TwilioJob < ApplicationJob
  def perform(restaurant, body:, to:)
    service = TwilioService.new(restaurant)

    service.message_create(body: body, to: to)
  end
end
