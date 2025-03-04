# frozen_string_literal: true

require "test_helper"

class FloorObjectsTest < ActionDispatch::IntegrationTest
  test "floor objects" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking = create(:booking,
                     booking_type: "dine_in",
                     pax: 1,
                     restaurant: restaurant,
                     table_names: [table.name],
                     user: user)

    authentic_query mobile_user_token(user, device), floor_objects, variables: {
      restaurantId: restaurant.id
    }

    assert_query_success
    assert_equal [{ "clockedInBooking" => { "id" => booking.id }, "id" => table.id }],
                 response.parsed_body["data"]["floorObjects"]
  end

  test "floor object update" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    existing_speaker = create(:floor_object, :speaker, object_type: "speaker", restaurant: restaurant)
    existing_table = create(:floor_object, :rectangular_table, restaurant: restaurant)

    assert_equal 2, FloorObject.count

    authentic_query web_admin_token(admin), floor_object_update, variables: {
      input: {
        restaurantId: restaurant.id,
        attributes: [
          {
            id: existing_speaker.id,
            name: "Speaker - 1"
          },
          {
            id: "random-id",
            name: "T1",
            objectType: "table",
            data: {
              addons: { type: "oval", chairQuantity: 2 },
              length: 1,
              rotate: 90,
              translateX: 40,
              translateY: 40,
              width: 1
            }
          }
        ]
      }
    }

    assert_query_success

    assert_equal 2, FloorObject.count
    assert_nil FloorObject.find_by(id: existing_table.id)
    assert FloorObject.find_by(name: "T1")

    assert_not_equal existing_speaker.attributes, FloorObject.find(existing_speaker.id).attributes
    assert_equal existing_speaker.data, FloorObject.find(existing_speaker.id).data
    assert_attributes FloorObject.find(existing_speaker.id), name: "Speaker - 1"
  end

  test "floor object force unlock" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["orders", "force_unlock"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    floor_object = create(:floor_object, :rectangular_table, active_user_full_name: user.full_name,
                                                             restaurant: restaurant)

    authentic_query mobile_user_token(user, device), floor_object_force_unlock, variables: {
      input: {
        floorObjectId: floor_object.id
      }
    }

    assert_query_success

    assert_nil floor_object.reload.active_user_full_name
  end

  private

  def floor_objects
    <<~GQL
      query floorObjects($restaurantId: ID!) {
        floorObjects(restaurantId: $restaurantId) {
          clockedInBooking {
            id
          }
          id
        }
      }
    GQL
  end

  def floor_object_update
    <<~GQL
      mutation floorObjectUpdate($input: FloorObjectUpdateInput!) {
        floorObjectUpdate(input: $input)
      }
    GQL
  end

  def floor_object_force_unlock
    <<~GQL
      mutation floorObjectForceUnlock($input: FloorObjectForceUnlockInput!) {
        floorObjectForceUnlock(input: $input)
      }
    GQL
  end
end
