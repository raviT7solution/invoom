# frozen_string_literal: true

require "test_helper"

class ReservationTest < ActiveSupport::TestCase
  include ActiveJob::TestHelper

  test "twilio job" do
    restaurant = create(
      :restaurant,
      timezone: "America/Toronto",
      twilio_account_sid: "twilio_account_sid",
      twilio_auth_token: "twilio_auth_token",
      twilio_sms_phone_number: "+123456"
    )
    customer = create(:customer, restaurant: restaurant)
    create(
      :reservation,
      adults: 3,
      customer: customer,
      kids: 2,
      reservation_at: "2024-04-01T05:00:00Z",
      restaurant: restaurant
    )

    expected_message = <<~MSG
      Dear Customer, your reservation is confirmed at #{restaurant.name}!
      Date: 04-01-2024
      Time: 01:00 AM
      Guests: 5
      We look forward to serving you!
      If you need to modify or cancel, call us at #{restaurant.phone_number}.
      See you soon!
    MSG

    assert_enqueued_with args: [restaurant, { body: expected_message, to: customer.phone_number }],
                         job: TwilioJob
  end
end
