# frozen_string_literal: true

require "test_helper"

class TaxesTest < ActionDispatch::IntegrationTest
  test "province and country based taxes" do
    restaurant = create(:restaurant, country: "CA", province: "ON")
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["takeout"], restaurant: restaurant)
    user = create(:user, roles: [role], restaurant: restaurant)
    tax = create(:tax, country: "CA", province: "ON")

    authentic_query mobile_user_token(user, device), taxes, variables: { restaurantId: restaurant.id }

    assert_query_success
    assert_equal [tax.id], response.parsed_body["data"]["taxes"].pluck("id")
  end

  test "postal code based taxes" do
    restaurant = create(:restaurant, country: "US", province: "CA", postal_code: "95113")
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["takeout"], restaurant: restaurant)
    user = create(:user, roles: [role], restaurant: restaurant)
    tax = create(:tax, country: "US", province: "CA", postal_code: "95113")

    authentic_query mobile_user_token(user, device), taxes, variables: { restaurantId: restaurant.id }

    assert_query_success
    assert_equal [tax.id], response.parsed_body["data"]["taxes"].pluck("id")
  end

  private

  def taxes
    <<~GQL
      query taxes($restaurantId: ID!) {
        taxes(restaurantId: $restaurantId){
          id
        }
      }
    GQL
  end
end
