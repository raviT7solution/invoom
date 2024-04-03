# frozen_string_literal: true

require "test_helper"

class AdminSessionsTest < ActionDispatch::IntegrationTest
  setup do
    @admin = create(:admin)
  end

  test "valid credentials" do
    query create_string, variables: { input: { email: @admin.email, password: @admin.password, subject: "web" } }

    assert_query_success

    token = response.parsed_body["data"]["adminSessionCreate"]["token"]

    assert_equal @admin, Session.new(token).web_admin!
    assert Session.new(token).web_admin?
    assert_not Session.new(token).mobile_admin?
    assert_not Session.new(token).mobile_user?
    assert_raises(GraphQL::ExecutionError) { Session.new(token).mobile_admin! }
    assert_raises(GraphQL::ExecutionError) { Session.new(token).mobile_user! }
  end

  test "invalid credentials" do
    query create_string, variables: { input: { email: @admin.email, password: "wrong", subject: "web" } }

    assert_query_error "Invalid password"
  end

  test "invalid admin" do
    query create_string, variables: { input: { email: "hacker", password: "wrong", subject: "web" } }

    assert_query_error "Admin not found"
  end

  test "valid token" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]
    create(:role, restaurant: restaurant)

    post \
      graphql_path,
      headers: { "Authorization" => "Bearer #{JWT.encode({ 'web_admin_id' => admin.id }, Session.secret)}" },
      params: { query: roles_index_string, variables: { restaurantId: restaurant.id } }

    assert_query_success
  end

  test "expired token" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]
    create(:role, restaurant: restaurant)

    exp = 2.days.ago.to_i

    post \
      graphql_path,
      headers: { "Authorization" => "Bearer #{JWT.encode({ 'web_admin_id' => admin.id, exp: exp }, Session.secret)}" },
      params: { query: roles_index_string, variables: { restaurantId: restaurant.id } }

    assert_query_error "Unauthorized"
  end

  test "invalid token with different secrets" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]
    create(:role, restaurant: restaurant)

    post \
      graphql_path,
      headers: { "Authorization" => "Bearer #{JWT.encode({ 'web_admin_id' => admin.id }, SecureRandom.uuid)}" },
      params: { query: roles_index_string, variables: { restaurantId: restaurant.id } }

    assert_query_error "Unauthorized"
  end

  test "no token passed for authorized query" do
    restaurant = create(:restaurant)
    create(:role, restaurant: restaurant)

    query roles_index_string, variables: { restaurantId: restaurant.id }

    assert_query_error "Unauthorized"
  end

  private

  def roles_index_string
    <<~GQL
      query roles($restaurantId: ID!) {
        roles(restaurantId: $restaurantId) {
          id
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
end
