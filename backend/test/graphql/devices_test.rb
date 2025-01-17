# frozen_string_literal: true

require "test_helper"

class DevicesTest < ActionDispatch::IntegrationTest
  test "device create" do
    restaurant = create(:restaurant)
    admin = create(:admin, restaurants: [restaurant])

    fingerprint = Faker::Device.serial

    authentic_query mobile_admin_token(admin), device_create, variables: {
      input: {
        attributes: {
          fingerprint: fingerprint,
          name: "iPad Pro"
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_success
    assert_attributes Device.last!,
                      fingerprint: fingerprint,
                      name: "iPad Pro",
                      restaurant_id: restaurant.id
  end

  private

  def device_create
    <<~GQL
      mutation deviceCreate($input: DeviceCreateInput!) {
        deviceCreate(input: $input)
      }
    GQL
  end
end
