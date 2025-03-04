# frozen_string_literal: true

require "test_helper"

class AdminSessionsTest < ActionDispatch::IntegrationTest
  setup do
    @admin = create(:admin)
  end

  test "valid credentials" do
    query create_string, variables: { input: { email: @admin.email, password: @admin.password, subject: "web_admin" } }

    assert_query_success

    token = response.parsed_body["data"]["adminSessionCreate"]["token"]

    assert_equal @admin, Session.find_signed!(token).web_admin!
    assert Session.find_signed!(token).web_admin?
    assert_not Session.find_signed!(token).mobile_admin?
    assert_not Session.find_signed!(token).mobile_user?
    assert_raises(GraphQL::ExecutionError) { Session.find_signed!(token).mobile_admin! }
    assert_raises(GraphQL::ExecutionError) { Session.find_signed!(token).mobile_user! }
  end

  test "invalid credentials" do
    query create_string, variables: { input: { email: @admin.email, password: "wrong", subject: "web_admin" } }

    assert_query_error "Invalid password"
  end

  test "invalid admin" do
    query create_string, variables: { input: { email: "hacker", password: "wrong", subject: "web_admin" } }

    assert_query_error "Admin not found"
  end

  test "valid token" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]
    create(:role, restaurant: restaurant)

    token = Session.create!(sessionable: admin, subject: "web_admin").signed_id(expires_in: 1.day)

    authentic_query token, current_admin

    assert_query_success
  end

  test "expired token" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]
    create(:role, restaurant: restaurant)

    token = Session.create!(sessionable: admin, subject: "web_admin").signed_id(expires_in: 15.minutes)

    travel 16.minutes

    authentic_query token, current_admin

    assert_query_error "Session not found"
  end

  test "invalid token with different secrets" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]
    create(:role, restaurant: restaurant)

    authentic_query "fake-token", current_admin

    assert_query_error "Session not found"
  end

  test "no token passed for authorized query" do
    query booking_clocked_out_at_update, variables: { id: SecureRandom.uuid, clockedOut: true }

    assert_query_error "Unauthorized"
  end

  test "public query" do
    query countries_query

    assert_query_success
  end

  private

  def booking_clocked_out_at_update
    <<~GQL
      mutation bookingClockedOutAtUpdate($id: ID!,$clockedOut: Boolean!) {
        bookingClockedOutAtUpdate(input: { id: $id,clockedOut: $clockedOut })
      }
    GQL
  end

  def countries_query
    <<~GQL
      query countries {
        countries {
          code
          name
        }
      }
    GQL
  end

  def create_string
    <<~GQL
      mutation adminSessionCreate($input: AdminSessionCreateInput!) {
        adminSessionCreate(input: $input) {
          token
        }
      }
    GQL
  end

  def current_admin
    <<~GQL
      query currentAdmin {
        currentAdmin {
          id
        }
      }
    GQL
  end
end
