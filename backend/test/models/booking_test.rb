# frozen_string_literal: true

require "test_helper"

class BookingTest < ActiveSupport::TestCase
  test "pax presence for dine-in booking" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])

    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking_table = build(:booking_table, floor_object: table)
    booking = build(
      :booking,
      booking_tables: [booking_table],
      booking_type: :dine_in,
      clocked_in_at: DateTime.current,
      restaurant: restaurant,
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
end
