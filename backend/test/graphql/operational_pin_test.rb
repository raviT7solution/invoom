# frozen_string_literal: true

require "test_helper"

class OperationalPinTest < ActionDispatch::IntegrationTest
  test "operation pin authenticate" do
    restaurant = create(:restaurant, pin: "5678")
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    authentic_query mobile_user_token(user, device), authenticate_mutation, variables: {
      input: {
        pin: "5679",
        restaurantId: restaurant.id
      }
    }

    assert_query_error "Invalid pin"

    authentic_query mobile_user_token(user, device), authenticate_mutation, variables: {
      input: {
        pin: "5678",
        restaurantId: restaurant.id
      }
    }

    assert_query_success
  end

  private

  def authenticate_mutation
    <<~GQL
      mutation operationalPinAuthenticate($input: OperationalPinAuthenticateInput!) {
        operationalPinAuthenticate(input: $input)
      }
    GQL
  end
end
