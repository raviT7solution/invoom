# frozen_string_literal: true

require "test_helper"

class ReservationsTest < ActionDispatch::IntegrationTest
  test "create reservation" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["reservations"], restaurant: restaurant)
    user = create(:user, roles: [role], restaurant: restaurant)
    customer = create(:customer, restaurant: restaurant)

    authentic_query mobile_user_token(user, device), reservation_create_string, variables: {
      input: {
        attributes: {
          adults: 1,
          customerId: customer.id,
          kids: 0,
          note: "Test",
          reservationAt: "2024-04-01T11:20:00",
          tableName: "T1"
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_success
    assert_attributes Reservation.last!,
                      adults: 1,
                      customer_id: customer.id,
                      kids: 0,
                      note: "Test",
                      table_name: "T1"
  end

  test "invalid permission" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, roles: [role], restaurant: restaurant)
    customer = create(:customer, restaurant: restaurant)

    authentic_query mobile_user_token(user, device), reservation_create_string, variables: {
      input: {
        attributes: {
          adults: 1,
          customerId: customer.id,
          kids: 0,
          reservationAt: "2024-04-01T11:20:00"
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_error "Unauthorized"
    assert_nil Reservation.last
  end

  test "update reservation" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["reservations"], restaurant: restaurant)
    user = create(:user, roles: [role], restaurant: restaurant)
    customer = create(:customer, restaurant: restaurant)
    reservation = create(:reservation, restaurant: restaurant, customer: customer)

    authentic_query mobile_user_token(user, device), reservation_update_string, variables: {
      input: {
        attributes: {
          status: "seated"
        },
        id: reservation.id
      }
    }

    assert_query_success
    assert_equal "seated", reservation.reload.status
  end

  test "reservations" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["reservations"], restaurant: restaurant)
    user = create(:user, roles: [role], restaurant: restaurant)
    customer = create(:customer, restaurant: restaurant)
    reservation = create(:reservation, restaurant: restaurant, customer: customer,
                                       reservation_at: "2024-04-02T11:20:00")

    authentic_query mobile_user_token(user, device), reservations_string, variables: {
      endTime: "2024-04-03T11:20:00",
      restaurantId: restaurant.id,
      startTime: "2024-04-01T11:20:00"
    }

    assert_query_success
    assert_equal({
                   "adults" => reservation.adults,
                   "customer" => { "name" => customer.name },
                   "id" => reservation.id,
                   "kids" => reservation.kids,
                   "note" => reservation.note,
                   "reservationAt" => reservation.reservation_at,
                   "status" => "pending",
                   "tableName" => reservation.table_name
                 },
                 response.parsed_body["data"]["reservations"][0])
  end

  private

  def reservation_create_string
    <<~GQL
      mutation reservationCreate($input: ReservationCreateInput!){
        reservationCreate(input: $input)
      }
    GQL
  end

  def reservation_update_string
    <<~GQL
      mutation reservationUpdate($input: ReservationUpdateInput!){
        reservationUpdate(input: $input)
      }
    GQL
  end

  def reservations_string
    <<~GQL
      query reservations(
        $endTime: ISO8601DateTime
        $restaurantId: ID!
        $startTime: ISO8601DateTime
      ) {
        reservations(
          endTime: $endTime
          restaurantId: $restaurantId
          startTime: $startTime
        ) {
          adults
          customer {
            name
          }
          id
          kids
          note
          reservationAt
          status
          tableName
        }
      }
    GQL
  end
end
