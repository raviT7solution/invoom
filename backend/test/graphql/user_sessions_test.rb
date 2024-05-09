# frozen_string_literal: true

require "test_helper"

class UserSessionsTest < ActionDispatch::IntegrationTest
  setup do
    @admin = create(:admin)
    @restaurant = create(:restaurant)
    @admin.restaurants = [@restaurant]

    @role = create(:role, permissions: ["clock_in_clock_out"], restaurant: @restaurant)
    @user = create(:user, roles: [@role], restaurant: @restaurant)
  end

  test "returns token for valid pin" do
    authentic_query @admin, "mobile_admin", create_string, variables: {
      input: {
        restaurantId: @restaurant.id,
        attributes: { clockType: "clock_in",
                      loginType: "pin",
                      pin: "1234",
                      userId: @user.id }
      }
    }

    assert_query_success

    token = response.parsed_body["data"]["userSessionCreate"]["token"]

    assert_equal @user, Session.new(token).mobile_user!
    assert_equal ["clock_in_clock_out"], response.parsed_body["data"]["userSessionCreate"]["permissions"]
    assert TimeSheet.last.start_time
    assert_not TimeSheet.last.end_time
  end

  test "returns token for valid password" do
    authentic_query @admin, "mobile_admin", create_string, variables: {
      input: {
        restaurantId: @restaurant.id,
        attributes: { clockType: "clock_in",
                      loginType: "password",
                      password: @user.password,
                      userId: @user.id }
      }
    }

    assert_query_success

    token = response.parsed_body["data"]["userSessionCreate"]["token"]

    assert_equal @user, Session.new(token).mobile_user!
    assert_equal ["clock_in_clock_out"], response.parsed_body["data"]["userSessionCreate"]["permissions"]
    assert TimeSheet.last.start_time
    assert_not TimeSheet.last.end_time
  end

  test "does not return token for clock out" do
    time_sheet = create(:time_sheet, user: @user, start_time: 2.days.ago)

    authentic_query @admin, "mobile_admin", create_string, variables: {
      input: {
        restaurantId: @restaurant.id,
        attributes: { clockType: "clock_out",
                      loginType: "pin",
                      pin: "1234",
                      userId: @user.id }
      }
    }

    assert_query_success
    assert_equal "", response.parsed_body["data"]["userSessionCreate"]["token"]
    assert time_sheet.reload.start_time
    assert time_sheet.end_time
  end

  test "when already clocked in" do
    time_sheet = create(:time_sheet, user: @user, start_time: 2.days.ago)

    authentic_query @admin, "mobile_admin", create_string, variables: {
      input: {
        restaurantId: @restaurant.id,
        attributes: { clockType: "clock_in",
                      loginType: "pin",
                      pin: "1234",
                      userId: @user.id }
      }
    }

    assert_query_success
    assert_equal \
      ({ "clockInStatus" => "already_clocked_in", "permissions" => [], "token" => "" }),
      response.parsed_body["data"]["userSessionCreate"]
    assert time_sheet.reload.start_time
    assert_not time_sheet.end_time
  end

  test "when already clocked out" do
    create(:time_sheet, user: @user, start_time: 2.days.ago, end_time: 1.day.ago)

    authentic_query @admin, "mobile_admin", create_string, variables: {
      input: {
        restaurantId: @restaurant.id,
        attributes: { clockType: "clock_out",
                      loginType: "pin",
                      pin: "1234",
                      userId: @user.id }
      }
    }

    assert_query_success
    assert_equal \
      ({ "clockInStatus" => "already_clocked_out", "permissions" => [], "token" => "" }),
      response.parsed_body["data"]["userSessionCreate"]
  end

  test "raises unauthorized error" do
    @role.update(permissions: [])
    create(:time_sheet, user: @user, start_time: 2.days.ago, end_time: 1.day.ago)

    authentic_query @admin, "mobile_admin", create_string, variables: {
      input: {
        restaurantId: @restaurant.id,
        attributes: { clockType: "clock_out",
                      loginType: "pin",
                      pin: "1234",
                      userId: @user.id }
      }
    }

    assert_query_error "Unauthorized"
  end

  private

  def create_string
    <<~GQL
      mutation userSessionCreate($input: UserSessionCreateInput!) {
        userSessionCreate(input: $input) {
          clockInStatus
          permissions
          token
        }
      }
    GQL
  end
end
