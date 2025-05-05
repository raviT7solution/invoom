# frozen_string_literal: true

require "test_helper"

class UserSessionsTest < ActionDispatch::IntegrationTest
  setup do
    @restaurant = create(:restaurant)
    @admin = create(:admin, restaurants: [@restaurant])
    @device = create(:device, restaurant: @restaurant)
    role = create(:role, permissions: ["clock_in_clock_out", "floor_plan"], restaurant: @restaurant)
    @user = create(:user, roles: [role], restaurant: @restaurant, pin: "1234")
  end

  test "returns token for valid pin" do
    authentic_query mobile_admin_token(@admin, @device), user_session_create, variables: {
      input: {
        restaurantId: @restaurant.id,
        attributes: {
          loginType: "pin",
          pin: "1234"
        }
      }
    }

    assert_query_success

    token = response.parsed_body["data"]["userSessionCreate"]["token"]

    assert_equal @user, Session.find_signed!(token).mobile_user!
    assert_equal ["clock_in_clock_out", "floor_plan"], response.parsed_body["data"]["userSessionCreate"]["permissions"]
    assert response.parsed_body["data"]["userSessionCreate"]["autoClockIn"]
  end

  test "returns token for valid password" do
    authentic_query mobile_admin_token(@admin, @device), user_session_create, variables: {
      input: {
        restaurantId: @restaurant.id,
        attributes: {
          loginType: "password",
          password: @user.password,
          userId: @user.id
        }
      }
    }

    assert_query_success

    token = response.parsed_body["data"]["userSessionCreate"]["token"]

    assert_equal @user, Session.find_signed!(token).mobile_user!
    assert_equal ["clock_in_clock_out", "floor_plan"], response.parsed_body["data"]["userSessionCreate"]["permissions"]
    assert response.parsed_body["data"]["userSessionCreate"]["autoClockIn"]
  end

  test "when already clocked in" do
    time_sheet = create(:time_sheet, user: @user, start_time: 2.days.ago)

    authentic_query mobile_admin_token(@admin, @device), user_session_create, variables: {
      input: {
        restaurantId: @restaurant.id,
        attributes: {
          loginType: "pin",
          pin: "1234"
        }
      }
    }

    assert_query_success

    assert_equal "already_clocked_in", response.parsed_body["data"]["userSessionCreate"]["clockInStatus"]
    assert_equal @user.permissions, response.parsed_body["data"]["userSessionCreate"]["permissions"]
    assert_equal @user, Session.find_signed!(response.parsed_body["data"]["userSessionCreate"]["token"]).mobile_user!

    assert time_sheet.reload.start_time
    assert_not time_sheet.end_time
  end

  test "when already clocked out" do
    create(:time_sheet, user: @user, start_time: 2.days.ago, end_time: 1.day.ago)

    authentic_query mobile_admin_token(@admin, @device), user_session_create, variables: {
      input: {
        restaurantId: @restaurant.id,
        attributes: {
          loginType: "pin",
          pin: "1234"
        }
      }
    }

    assert_query_success
    assert_equal "already_clocked_out", response.parsed_body["data"]["userSessionCreate"]["clockInStatus"]
    assert_equal @user.permissions, response.parsed_body["data"]["userSessionCreate"]["permissions"]
    assert_equal @user, Session.find_signed!(response.parsed_body["data"]["userSessionCreate"]["token"]).mobile_user!
  end

  test "time sheet create session" do
    create(:time_sheet, user: @user, start_time: 2.days.ago)

    authentic_query mobile_user_token(@user, @device), user_session_time_sheet_create, variables: { input: {} }

    assert_query_error "User is already clocked-in"

    authentic_query mobile_user_token(@user, @device), user_session_destroy, variables: { input: {} }
    authentic_query mobile_user_token(@user, @device), user_session_time_sheet_create, variables: { input: {} }

    assert_query_success
    assert TimeSheet.order(:created_at).last.start_time
    assert_not TimeSheet.order(:created_at).last.end_time
  end

  test "destroy session" do
    create(:time_sheet, user: @user, start_time: 2.days.ago)

    authentic_query mobile_user_token(@user, @device), user_session_destroy, variables: { input: {} }

    assert_query_success
    assert_nil @user.time_sheets.find_by(end_time: nil)

    create(:time_sheet, user: @user, start_time: 2.days.ago, end_time: 1.day.ago)

    authentic_query mobile_user_token(@user, @device), user_session_destroy, variables: { input: {} }

    assert_query_success
  end

  test "expired token" do
    token = Session.create!(sessionable: @admin, subject: "web_admin").signed_id(expires_in: 15.minutes)

    travel 16.minutes

    authentic_query token, current_user

    assert_query_error "Session not found"
  end

  test "invalid token with different secrets" do
    authentic_query "fake-token", current_user

    assert_query_error "Session not found"
  end

  private

  def current_user
    <<~GQL
      query currentUser {
        currentUser {
          gender
          id
          preferredName
        }
      }
    GQL
  end

  def user_session_create
    <<~GQL
      mutation userSessionCreate($input: UserSessionCreateInput!) {
        userSessionCreate(input: $input) {
          autoClockIn
          clockInStatus
          permissions
          token
        }
      }
    GQL
  end

  def user_session_destroy
    <<~GQL
      mutation userSessionDestroy($input: UserSessionDestroyInput!) {
        userSessionDestroy(input: $input)
      }
    GQL
  end

  def user_session_time_sheet_create
    <<~GQL
      mutation userSessionTimeSheetCreate($input: UserSessionTimeSheetCreateInput!) {
        userSessionTimeSheetCreate(input: $input)
      }
    GQL
  end
end
