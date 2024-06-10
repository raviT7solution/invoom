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
          customerId: customer.id,
          reservationAt: "2024-04-01T11:20:00",
          pax: 1
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_success
    assert_attributes Reservation.last!, \
                      customer_id: customer.id,
                      pax: 1
  end

  test "invalid permission" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, roles: [role], restaurant: restaurant)
    customer = create(:customer, restaurant: restaurant)

    authentic_query user, "mobile_user", reservation_create_string, variables: {
      input: {
        attributes: {
          customerId: customer.id,
          reservationAt: "2024-04-01T11:20:00",
          pax: 1
        },
        restaurantId: restaurant.id
      }
    }

    assert_query_error "Unauthorized"
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
    assert_equal({ "id" => reservation.id,
                   "pax" => reservation.pax,
                   "reservationAt" => reservation.reservation_at,
                   "status" => "pending",
                   "customer" => { "name" => customer.name } },
                 response.parsed_body["data"]["reservations"]["collection"][0])
  end

  private

  def reservation_create_string
    <<~GQL
      mutation ReservationCreate($input: ReservationCreateInput!){
        reservationCreate(input: $input)
      }
    GQL
  end

  def reservation_update_string
    <<~GQL
      mutation ReservationUpdate($input: ReservationUpdateInput!){
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
            id
            pax
            reservationAt
            status
            customer {
              name
            }
          }
        }
      }
    GQL
  end
end
