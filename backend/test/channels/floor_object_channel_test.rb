# frozen_string_literal: true

require "test_helper"

class FloorObjectChannelTest < ActionCable::Channel::TestCase
  test "floor object channel" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    floor_object = create(:floor_object, :rectangular_table, restaurant: restaurant)

    subscribe(
      "Authorization" => Session.token(user, "mobile_user_id"),
      "floor_object_id" => floor_object.id,
      "restaurant_id" => restaurant.id
    )

    assert subscription.confirmed?
    assert_equal user.full_name, floor_object.reload.active_user_full_name
    assert_has_stream_for floor_object

    unsubscribe

    assert_nil floor_object.reload.active_user_full_name
  end
end
