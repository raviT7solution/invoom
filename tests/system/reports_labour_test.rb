# frozen_string_literal: true

require "application_system_test_case"

class ReportsLabourTest < ApplicationSystemTestCase
  test "table data" do
    admin = create(:admin)
    restaurant = create(:restaurant, country: "CA", province: "ON")
    admin.restaurants = [restaurant]

    user = create(:user, restaurant: restaurant)

    time_sheet = create(:time_sheet, user: user, start_time: DateTime.current)

    sign_in(admin)
    visit path_for(:frontend, "/reports/labour")
    wait_for_pending_requests

    assert_text time_sheet.user.first_name
  end
end
