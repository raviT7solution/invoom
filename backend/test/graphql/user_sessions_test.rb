# frozen_string_literal: true

require "test_helper"

class UserSessionsTest < ActionDispatch::IntegrationTest
  setup do
    @admin = create(:admin)
    @restaurant = create(:restaurant)
    @admin.restaurants = [@restaurant]

    @role = create(:role, permissions: ["clock_in_clock_out", "floor_plan"], restaurant: @restaurant)
    @user = create(:user, roles: [@role], restaurant: @restaurant, pin: "1234")
  end

  test "returns token for valid pin" do
    authentic_query @admin, "mobile_admin", create_string, variables: {
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

    assert_equal @user, Session.new(token).mobile_user!
    assert_equal ["clock_in_clock_out", "floor_plan"], response.parsed_body["data"]["userSessionCreate"]["permissions"]
    assert response.parsed_body["data"]["userSessionCreate"]["autoClockIn"]
  end

  test "returns token for valid password" do
    authentic_query @admin, "mobile_admin", create_string, variables: {
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

    assert_equal @user, Session.new(token).mobile_user!
    assert_equal ["clock_in_clock_out", "floor_plan"], response.parsed_body["data"]["userSessionCreate"]["permissions"]
    assert response.parsed_body["data"]["userSessionCreate"]["autoClockIn"]
  end

  test "when already clocked in" do
    time_sheet = create(:time_sheet, user: @user, start_time: 2.days.ago)

    authentic_query @admin, "mobile_admin", create_string, variables: {
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
    assert_equal @user, Session.new(response.parsed_body["data"]["userSessionCreate"]["token"]).mobile_user!

    assert time_sheet.reload.start_time
    assert_not time_sheet.end_time
  end

  test "when already clocked out" do
    create(:time_sheet, user: @user, start_time: 2.days.ago, end_time: 1.day.ago)

    authentic_query @admin, "mobile_admin", create_string, variables: {
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
    assert_equal @user, Session.new(response.parsed_body["data"]["userSessionCreate"]["token"]).mobile_user!
  end

  test "time sheet create session" do
    create(:time_sheet, user: @user, start_time: 2.days.ago)

    authentic_query @user, "mobile_user", user_session_time_sheet_create, variables: { input: {} }

    assert_query_error "User is already clocked-in"

    authentic_query @user, "mobile_user", destroy_string, variables: { input: {} }
    authentic_query @user, "mobile_user", user_session_time_sheet_create, variables: { input: {} }

    assert_query_success
    assert TimeSheet.order(:created_at).last.start_time
    assert_not TimeSheet.order(:created_at).last.end_time
  end

  test "destroy session" do
    create(:time_sheet, user: @user, start_time: 2.days.ago)

    authentic_query @user, "mobile_user", destroy_string, variables: { input: {} }

    assert_query_success
    assert_nil @user.time_sheets.find_by(end_time: nil)

    create(:time_sheet, user: @user, start_time: 2.days.ago, end_time: 1.day.ago)

    authentic_query @user, "mobile_user", destroy_string, variables: { input: {} }

    assert_query_success
  end

  test "expired token" do
    exp = 2.days.ago.to_i

    post \
      graphql_path,
      headers: {
        "Authorization" => "Bearer #{JWT.encode({ 'mobile_user_id' => @user.id, exp: exp }, Session.secret)}"
      },
      params: { query: current_user_string }

    assert_query_error "Session not found"
  end

  test "invalid token with different secrets" do
    post \
      graphql_path,
      headers: { "Authorization" => "Bearer #{JWT.encode({ 'mobile_user_id' => @user.id }, SecureRandom.uuid)}" },
      params: { query: current_user_string }

    assert_query_error "Session not found"
  end

  private

  def current_user_string
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

  def create_string
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

  def destroy_string
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
