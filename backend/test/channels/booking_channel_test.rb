# frozen_string_literal: true

require "test_helper"

class BookingChannelTest < ActionCable::Channel::TestCase
  test "booking channel" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 1, table_names: ["T1"])

    subscribe(
      "Authorization" => mobile_user_token(user, device),
      "booking_id" => booking.id,
      "restaurant_id" => restaurant.id
    )

    assert subscription.confirmed?
    assert_equal user.full_name, booking.reload.active_user_full_name
    assert_has_stream_for booking

    unsubscribe

    assert_nil booking.reload.active_user_full_name
  end
end
