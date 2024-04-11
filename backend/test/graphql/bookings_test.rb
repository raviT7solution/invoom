# frozen_string_literal: true

require "test_helper"

class BookingsTest < ActionDispatch::IntegrationTest
  test "create dine_in" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])
    table1 = create(:floor_object, restaurant: restaurant)
    table2 = create(:floor_object, restaurant: restaurant)

    authentic_query user, "mobile_user", booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "dine_in",
          clockedInAt: DateTime.current.iso8601,
          floorObjectIds: [table1.id, table2.id]
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_success
    booking = Booking.last!

    assert_equal booking.id, response.parsed_body["data"]["bookingCreate"]
    assert_attributes booking, \
                      booking_type: "dine_in"
    assert_equal [table1.id, table2.id].sort, booking.booking_tables.map(&:floor_object_id).sort
    assert_equal booking.clocked_in_at.to_date, Date.current
  end

  test "create takeout" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])
    table1 = create(:floor_object, restaurant: restaurant)
    table2 = create(:floor_object, restaurant: restaurant)

    authentic_query user, "mobile_user", booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "takeout",
          clockedInAt: DateTime.current.iso8601,
          floorObjectIds: [table1.id, table2.id]
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_error "Booking tables is the wrong length"
    assert_nil Booking.last

    authentic_query user, "mobile_user", booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "takeout",
          clockedInAt: DateTime.current.iso8601
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_success
    booking = Booking.last!

    assert_attributes booking, \
                      booking_type: "takeout"
  end

  test "dine-in booking must have a table" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])

    authentic_query user, "mobile_user", booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "dine_in",
          clockedInAt: DateTime.current.iso8601,
          floorObjectIds: []
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_error "Booking tables is too short"
    assert_nil Booking.last
  end

  test "floor object must be table for dine_in booking" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])
    buffet = create(:floor_object, object_type: "buffet", restaurant: restaurant)

    authentic_query user, "mobile_user", booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "dine_in",
          clockedInAt: DateTime.current.iso8601,
          floorObjectIds: [buffet.id]
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_error "FloorObject not found"
  end

  test "booked table can not be utilized for new booking" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])
    other_user = create(:user, restaurant: restaurant, pin: "9999")

    used_table = create(:floor_object, restaurant: restaurant)
    unused_table = create(:floor_object, restaurant: restaurant)

    used_booking_table = build(:booking_table, floor_object: used_table)
    create(:booking, restaurant: restaurant, user: other_user, booking_type: "dine_in",
                     booking_tables: [used_booking_table])

    authentic_query user, "mobile_user", booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "dine_in",
          clockedInAt: Time.zone.now.strftime("%Y-%m-%dT%H:%M:%S"),
          floorObjectIds: [used_table.id, unused_table.id]
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_error "#{used_table.name} is already booked"
    assert_nil unused_table.reload.booking_table
  end

  private

  def booking_create_string
    <<~GQL
      mutation BookingCreate($input: BookingCreateInput!) {
        bookingCreate(input: $input)
      }
    GQL
  end
end
