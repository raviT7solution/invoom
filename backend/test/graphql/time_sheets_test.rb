# frozen_string_literal: true

require "test_helper"

class TimeSheetsTest < ActionDispatch::IntegrationTest
  test "time sheets summary" do
    restaurant = create(:restaurant)
    admin = create(:admin, restaurant_ids: [restaurant.id])
    user = create(:user, restaurant: restaurant)

    start_time = Time.current.beginning_of_day

    create(:time_sheet, user: user, start_time: start_time, end_time: start_time + 3.hours) # 3 hours
    create(:time_sheet, user: user, start_time: start_time + 5.hours, end_time: start_time + 8.hours) # 3 hours
    create(:time_sheet, user: user, start_time: start_time + 10.hours, end_time: start_time + 12.hours) # 2 hours
    create(:time_sheet, user: user, start_time: start_time + 14.hours, end_time: start_time + 17.hours) # 3 hours
    create(:time_sheet, user: user, start_time: start_time + 19.hours, end_time: start_time + 20.hours) # 1 hour

    authentic_query web_admin_token(admin), time_sheet_summary, variables: {
      restaurantId: restaurant.id,
      userIds: []
    }

    assert_query_success
    assert_in_delta 12.0, response.parsed_body["data"]["timeSheetSummary"]["totalHours"]
  end

  private

  def time_sheet_summary
    <<~GQL
      query timeSheetSummary(
        $endTime: ISO8601DateTime
        $restaurantId: ID!
        $startTime: ISO8601DateTime
        $userIds: [ID!]
      ) {
        timeSheetSummary(
          endTime: $endTime
          restaurantId: $restaurantId
          startTime: $startTime
          userIds: $userIds
        ) {
          totalHours
        }
      }
    GQL
  end
end
