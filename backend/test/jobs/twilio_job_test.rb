# frozen_string_literal: true

require "test_helper"
require "minitest/mock"

class TwilioJobTest < ActiveJob::TestCase
  test "message create" do
    restaurant = create(:restaurant)

    body = "Test"
    to = Faker::PhoneNumber.cell_phone_in_e164

    mock = Minitest::Mock.new
    mock.expect :message_create, true, body: body, to: to

    TwilioService.stub :new, mock do
      perform_enqueued_jobs do
        TwilioJob.perform_later(restaurant, body: body, to: to)
      end
    end

    assert_mock mock
  end
end
