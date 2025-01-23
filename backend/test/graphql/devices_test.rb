# frozen_string_literal: true

require "test_helper"

class DevicesTest < ActionDispatch::IntegrationTest
  test "device create" do
    restaurant = create(:restaurant)
    admin = create(:admin, restaurants: [restaurant])

    token = mobile_admin_token(admin)
    session = Session.find_signed!(token)

    fingerprint = Faker::Device.serial

    authentic_query token, device_create, variables: {
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
    assert_attributes session.reload,
                      device_id: Device.last!.id
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
