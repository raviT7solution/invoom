# frozen_string_literal: true

require "test_helper"

class ReservationTest < ActionDispatch::IntegrationTest
  test "create reservation" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["reservations"], restaurant: restaurant)
    user = create(:user, roles: [role], restaurant: restaurant)
    customer = create(:customer, restaurant: restaurant)

    authentic_query user, "mobile_user", reservation_create_string, variables: {
      input: {
        attributes: {
          adults: 1,
          customerId: customer.id,
          kids: 0,
          reservationAt: "2024-04-01T11:20:00",
          specialRequest: "Test"
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_success
    assert_attributes Reservation.last!, \
                      adults: 1,
                      customer_id: customer.id,
                      kids: 0,
                      special_request: "Test"
  end

  test "invalid permission" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, roles: [role], restaurant: restaurant)
    customer = create(:customer, restaurant: restaurant)

    authentic_query user, "mobile_user", reservation_create_string, variables: {
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

  test "delete reservation" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["reservations"], restaurant: restaurant)
    user = create(:user, roles: [role], restaurant: restaurant)
    customer = create(:customer, restaurant: restaurant)
    reservation = create(:reservation, restaurant: restaurant, customer: customer)

    authentic_query user, "mobile_user", reservation_delete, variables: {
      input: {
        id: reservation.id
      }
    }

    assert_query_success
    assert_nil Reservation.last
  end

  test "update reservation" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["reservations"], restaurant: restaurant)
    user = create(:user, roles: [role], restaurant: restaurant)
    customer = create(:customer, restaurant: restaurant)
    reservation = create(:reservation, restaurant: restaurant, customer: customer)

    authentic_query user, "mobile_user", reservation_update_string, variables: {
      input: {
        attributes: {
          status: "completed"
        },
        id: reservation.id
      }
    }

    assert_query_success
    assert_equal "completed", reservation.reload.status
  end

  test "reservations" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["reservations"], restaurant: restaurant)
    user = create(:user, roles: [role], restaurant: restaurant)
    customer = create(:customer, restaurant: restaurant)
    reservation = create(:reservation, restaurant: restaurant, customer: customer,
                                       reservation_at: "2024-04-02T11:20:00")

    authentic_query user, "mobile_user", reservations_string, variables: {
      endTime: "2024-04-03T11:20:00",
      page: 1,
      perPage: 100,
      restaurantId: restaurant.id,
      startTime: "2024-04-01T11:20:00"
    }

    assert_query_success
    assert_equal({
                   "adults" => reservation.adults,
                   "customer" => { "name" => customer.name },
                   "id" => reservation.id,
                   "kids" => reservation.kids,
                   "reservationAt" => reservation.reservation_at,
                   "specialRequest" => reservation.special_request,
                   "status" => "pending"
                 },
                 response.parsed_body["data"]["reservations"]["collection"][0])
  end

  private

  def reservation_create_string
    <<~GQL
      mutation reservationCreate($input: ReservationCreateInput!){
        reservationCreate(input: $input)
      }
    GQL
  end

  def reservation_delete
    <<~GQL
      mutation reservationDelete($input: ReservationDeleteInput!){
        reservationDelete(input: $input)
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
        $page: Int!
        $perPage: Int!
        $restaurantId: ID!
        $startTime: ISO8601DateTime
        $status: String
      ) {
        reservations(
          endTime: $endTime
          page: $page
          perPage: $perPage
          restaurantId: $restaurantId
          startTime: $startTime
          status: $status
        ) {
          collection {
            adults
            customer {
              name
            }
            id
            kids
            reservationAt
            specialRequest
            status
          }
        }
      }
    GQL
  end
end
