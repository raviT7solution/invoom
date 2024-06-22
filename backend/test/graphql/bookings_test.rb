# frozen_string_literal: true

require "test_helper"

class BookingsTest < ActionDispatch::IntegrationTest
  test "bookings" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])
    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking_table = build(:booking_table, floor_object: table)
    booking = create(:booking,
                     booking_tables: [booking_table],
                     booking_type: "dine_in",
                     clocked_in_at: "2024-04-02T11:20:00",
                     pax: 1,
                     restaurant: restaurant,
                     user: user)

    authentic_query user, "mobile_user", bookings, variables: {
      bookingTypes: ["dine_in"],
      endDate: "2024-04-03T11:20:00",
      page: 1,
      perPage: 100,
      restaurantId: restaurant.id,
      startDate: "2024-04-01T11:20:00",
      status: "current"
    }

    assert_query_success
    assert_equal \
      ({ "id" => booking.id }), response.parsed_body["data"]["bookings"]["collection"][0]
  end

  test "create dine_in" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])
    table1 = create(:floor_object, :rectangular_table, restaurant: restaurant)
    table2 = create(:floor_object, :rectangular_table, restaurant: restaurant)

    authentic_query user, "mobile_user", booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "dine_in",
          floorObjectIds: [table1.id, table2.id],
          pax: 1
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_success
    booking = Booking.last!

    assert_equal booking.id, response.parsed_body["data"]["bookingCreate"]
    assert_attributes booking, \
                      booking_type: "dine_in"
    assert_nil booking.token
    assert_equal [table1.id, table2.id].sort, booking.booking_tables.map(&:floor_object_id).sort
    assert_equal booking.clocked_in_at.to_date, Date.current
  end

  test "create takeout" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders", "takeout"])
    user = create(:user, restaurant: restaurant, roles: [role])

    customer = create(:customer, restaurant: restaurant)
    table1 = create(:floor_object, :rectangular_table, restaurant: restaurant)
    table2 = create(:floor_object, :rectangular_table, restaurant: restaurant)

    authentic_query user, "mobile_user", booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "takeout",
          customerId: customer.id,
          estimatedDuration: "00:15",
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
          estimatedDuration: "00:15",
          customerId: customer.id
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_success
    booking = Booking.last!

    assert_attributes booking, \
                      booking_type: "takeout",
                      estimated_duration: "00:15",
                      token: 1
  end

  test "dine-in booking must have a table" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])

    authentic_query user, "mobile_user", booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "dine_in",
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
    buffet = create(:floor_object, :speaker, object_type: "speaker", restaurant: restaurant)

    authentic_query user, "mobile_user", booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "dine_in",
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

    used_table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    unused_table = create(:floor_object, :rectangular_table, restaurant: restaurant)

    used_booking_table = build(:booking_table, floor_object: used_table)
    create(:booking, restaurant: restaurant, user: other_user, booking_type: "dine_in", pax: 1,
                     booking_tables: [used_booking_table])

    authentic_query user, "mobile_user", booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "dine_in",
          floorObjectIds: [used_table.id, unused_table.id]
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_error "#{used_table.name} is already booked"
    assert_nil unused_table.reload.booking_table
  end

  test "booking update" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])
    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking_table = build(:booking_table, floor_object: table)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 1,
                               booking_tables: [booking_table])

    authentic_query user, "mobile_user", booking_update_string, variables: {
      input: {
        attributes: {
          pax: 3
        },
        id: booking.id
      }
    }

    assert_query_success
    assert_equal 3, booking.reload.pax
  end

  test "booking close" do
    restaurant = create(:restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])

    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2,
                               booking_tables: [build(:booking_table, floor_object: table)])

    ticket = create(:ticket, booking: booking)
    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))

    create(:ticket_item, ticket: ticket, item: item, status: :cancelled)
    ticket_item = create(:ticket_item, ticket: ticket, item: item, status: :queued)

    authentic_query user, "mobile_user", booking_close, variables: { id: booking.id }

    assert_query_error "Item(s) still present in kitchen"
    assert_nil booking.reload.clocked_out_at

    ticket_item.update!(status: :cancelled)

    authentic_query user, "mobile_user", booking_close, variables: { id: booking.id }

    assert_query_success
    assert_not booking.booking_tables.where.not(floor_object_id: nil).exists?
    assert_not_nil booking.reload.clocked_out_at
  end

  private

  def bookings
    <<~GQL
      query bookings(
        $bookingTypes: [String!]!
        $endDate: ISO8601DateTime
        $page: Int!
        $perPage: Int!
        $restaurantId: ID!
        $startDate: ISO8601DateTime
        $status: String!
      ) {
        bookings(
          bookingTypes: $bookingTypes
          endDate: $endDate
          page: $page
          perPage: $perPage
          restaurantId: $restaurantId
          startDate: $startDate
          status: $status
        ) {
          collection {
            id
          }
        }
      }
    GQL
  end

  def booking_create_string
    <<~GQL
      mutation BookingCreate($input: BookingCreateInput!) {
        bookingCreate(input: $input)
      }
    GQL
  end

  def booking_update_string
    <<~GQL
      mutation BookingUpdate($input: BookingUpdateInput!) {
        bookingUpdate(input: $input)
      }
    GQL
  end

  def booking_close
    <<~GQL
      mutation bookingClose($id: ID!) {
        bookingClose(input: { id: $id })
      }
    GQL
  end
end
