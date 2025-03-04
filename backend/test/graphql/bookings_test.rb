# frozen_string_literal: true

require "test_helper"

class BookingsTest < ActionDispatch::IntegrationTest
  test "bookings" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])
    booking = create(:booking,
                     booking_type: "dine_in",
                     clocked_in_at: "2024-04-02T11:20:00",
                     pax: 1,
                     restaurant: restaurant,
                     table_names: ["T1"],
                     user: user)

    authentic_query mobile_user_token(user, device), bookings, variables: {
      bookingTypes: ["dine_in"],
      endDate: "2024-04-03T11:20:00",
      page: 1,
      perPage: 100,
      restaurantId: restaurant.id,
      startDate: "2024-04-01T11:20:00",
      status: "current",
      tableName: "T1"
    }

    assert_query_success
    assert_equal \
      ({ "id" => booking.id }), response.parsed_body["data"]["bookings"]["collection"][0]
  end

  test "create dine_in" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])

    authentic_query mobile_user_token(user, device), booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "dine_in",
          pax: 1,
          tableNames: ["T1", "T2"]
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_success
    booking = Booking.last!

    assert_equal booking.id, response.parsed_body["data"]["bookingCreate"]
    assert_attributes booking, \
                      booking_type: "dine_in",
                      pax: 1,
                      table_names: ["T1", "T2"],
                      token: nil,
                      user: user
    assert_equal booking.clocked_in_at.to_date, Date.current
  end

  test "create takeout" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders", "takeout"])
    user = create(:user, restaurant: restaurant, roles: [role])

    customer = create(:customer, restaurant: restaurant)

    authentic_query mobile_user_token(user, device), booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "takeout",
          customerId: customer.id,
          estimatedDuration: "00:15",
          tableNames: ["T1", "T2"]
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_error "Table names must be blank"
    assert_nil Booking.last

    authentic_query mobile_user_token(user, device), booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "takeout",
          customerId: customer.id,
          estimatedDuration: "00:15"
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
    device = create(:device, restaurant: restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])

    authentic_query mobile_user_token(user, device), booking_create_string, variables: {
      input: {
        attributes: {
          bookingType: "dine_in",
          pax: 2,
          tableNames: []
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_error "Table names can't be blank"
    assert_nil Booking.last
  end

  test "booking update" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 1, table_names: ["T1"])
    customer = create(:customer, restaurant: restaurant)

    authentic_query mobile_user_token(user, device), booking_update_string, variables: {
      input: {
        attributes: {
          customerId: customer.id,
          pax: 3
        },
        id: booking.id
      }
    }

    assert_query_success
    assert_attributes booking.reload,
                      customer_id: customer.id,
                      pax: 3
  end

  test "booking close" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, restaurant: restaurant, permissions: ["orders"])
    user = create(:user, restaurant: restaurant, roles: [role])

    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2, table_names: ["T1"])

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))

    ticket = create(:ticket, booking: booking)
    ticket_item = create(:ticket_item, ticket: ticket, item: item)

    # without invoices
    authentic_query mobile_user_token(user, device), booking_clocked_out_at_update, variables: {
      clockedOut: true,
      id: booking.id
    }

    assert_query_error "Unprocessed invoice(s)"
    assert_nil booking.reload.clocked_out_at

    invoice = create(:invoice, booking: booking)
    create(:invoice_item, ticket_item: ticket_item, invoice: invoice)

    # with unpaid invoice
    authentic_query mobile_user_token(user, device), booking_clocked_out_at_update, variables: {
      clockedOut: true,
      id: booking.id
    }

    assert_query_error "Unprocessed invoice(s)"
    assert_nil booking.reload.clocked_out_at

    create(:payment, invoice: invoice, amount: invoice.invoice_summary.total)

    # with paid invoice
    authentic_query mobile_user_token(user, device), booking_clocked_out_at_update, variables: {
      clockedOut: true,
      id: booking.id
    }

    assert_query_success
    assert_not_nil booking.reload.clocked_out_at
  end

  test "booking force clock out" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["orders", "force_clock_out"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2, table_names: ["T1"])

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))

    ticket = create(:ticket, booking: booking)
    ticket_item = create(:ticket_item, ticket: ticket, name: item.name, price: item.price, quantity: 2, item: item)

    invoice = create(:invoice, booking: booking)
    invoice_item = create(:invoice_item, ticket_item: ticket_item, invoice: invoice)

    authentic_query mobile_user_token(user, device), booking_force_clock_out, variables: {
      input: {
        bookingId: booking.id
      }
    }

    assert_query_error "Cannot delete record because dependent invoices exist"
    assert_equal 1, Ticket.count
    assert_equal 1, TicketItem.count
    assert_nil booking.reload.clocked_out_at

    invoice_item.destroy!
    invoice.destroy!

    authentic_query mobile_user_token(user, device), booking_force_clock_out, variables: {
      input: {
        bookingId: booking.id
      }
    }

    assert_query_success
    assert_not Booking.exists?(id: booking.id)
  end

  test "booking force clock with pin" do
    restaurant = create(:restaurant, pin: "1234")
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2, table_names: ["T1"])

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))

    ticket = create(:ticket, booking: booking)
    create(:ticket_item, ticket: ticket, name: item.name, price: item.price, quantity: 2, item: item)

    authentic_query mobile_user_token(user, device), booking_force_clock_out, variables: {
      input: {
        bookingId: booking.id
      }
    }

    assert_query_error "Invalid pin"
    assert_nil booking.reload.clocked_out_at

    authentic_query mobile_user_token(user, device), booking_force_clock_out, variables: {
      input: {
        bookingId: booking.id,
        pin: "1234"
      }
    }

    assert_query_success
    assert_not Booking.exists?(id: booking.id)
  end

  test "booking users update" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["orders", "floor_plan"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])
    another_user = create(:user, restaurant: restaurant, roles: [role])

    table = create(:floor_object, :rectangular_table, restaurant: restaurant)

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))

    booking_one = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2,
                                   table_names: [table.name])
    booking_two = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2,
                                   table_names: [table.name])
    booking_three = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2,
                                     table_names: [table.name])

    ticket = create(:ticket, booking: booking_one)
    ticket_item = create(:ticket_item, ticket: ticket, item: item)

    invoice = create(:invoice, booking: booking_one)
    create(:invoice_item, ticket_item: ticket_item, invoice: invoice)
    create(:payment, invoice: invoice, amount: invoice.invoice_summary.total)

    booking_one.update(clocked_out_at: Time.current)

    authentic_query mobile_user_token(user, device), booking_users_update_string, variables: {
      input: {
        tableName: table.name,
        userId: another_user.id
      }
    }

    assert_query_success
    assert_equal booking_one.reload.user_id, user.id
    assert_equal booking_two.reload.user_id, another_user.id
    assert_equal booking_three.reload.user_id, another_user.id
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
        $tableName: String
      ) {
        bookings(
          bookingTypes: $bookingTypes
          endDate: $endDate
          page: $page
          perPage: $perPage
          restaurantId: $restaurantId
          startDate: $startDate
          status: $status
          tableName: $tableName
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

  def booking_clocked_out_at_update
    <<~GQL
      mutation bookingClockedOutAtUpdate($id: ID!,$clockedOut: Boolean!) {
        bookingClockedOutAtUpdate(input: { id: $id,clockedOut: $clockedOut })
      }
    GQL
  end

  def booking_force_clock_out
    <<~GQL
      mutation bookingForceClockOut($input: BookingForceClockOutInput!) {
        bookingForceClockOut(input: $input)
      }
    GQL
  end

  def booking_users_update_string
    <<~GQL
      mutation bookingUsersUpdate($input: BookingUsersUpdateInput!) {
        bookingUsersUpdate(input: $input)
      }
    GQL
  end
end
