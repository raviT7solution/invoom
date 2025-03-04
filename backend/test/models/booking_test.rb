# frozen_string_literal: true

require "test_helper"

class BookingTest < ActiveSupport::TestCase
  test "pax presence for dine-in booking" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])

    booking = build(
      :booking,
      booking_type: :dine_in,
      clocked_in_at: DateTime.current,
      restaurant: restaurant,
      table_names: ["T1"],
      user: user
    )

    assert_not booking.valid?
    assert_includes booking.errors[:pax], "can't be blank"

    booking.pax = 0

    assert_not booking.valid?
    assert_includes booking.errors[:pax], "must be greater than 0"

    booking.pax = 4

    assert booking.valid?
  end

  test "estimated duration absence for dine_in" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])

    booking = build(
      :booking,
      booking_type: :dine_in,
      clocked_in_at: DateTime.current,
      pax: 1,
      restaurant: restaurant,
      table_names: ["T1"],
      user: user
    )

    assert booking.valid?

    booking.estimated_duration = "00:15"

    assert_not booking.valid?
  end
end
