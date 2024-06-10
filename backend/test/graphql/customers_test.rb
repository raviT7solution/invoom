# frozen_string_literal: true

require "test_helper"

class CustomersTest < ActionDispatch::IntegrationTest
  test "create customer" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["takeout"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    authentic_query user, "mobile_user", customer_create_string, variables: {
      input: {
        restaurantId: restaurant.id,
        attributes: {
          name: "Elvis",
          phoneNumber: "1234"
        }
      }
    }

    assert_query_success
    assert response.parsed_body["data"]["customerCreate"]
    assert_attributes Customer.last, name: "Elvis", phone_number: "1234"
  end

  test "customers" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["takeout"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])
    customer = create(:customer, email: "elvis@example.com", name: "Elvis", restaurant: restaurant)
    create(:customer, name: "Erika", restaurant: restaurant)

    authentic_query user, "mobile_user", index_string,
                    variables: { restaurantId: restaurant.id, query: "El", page: 1, perPage: 10 }

    assert_query_success
    assert_equal [{ "email" => "elvis@example.com", "name" => "Elvis", "phoneNumber" => customer.phone_number }],
                 response.parsed_body["data"]["customers"]["collection"]
  end

  private

  def index_string
    <<~GQL
      query customers(
        $page: Int!
        $perPage: Int!
        $query: String!
        $restaurantId: ID!
      ) {
        customers(
          page: $page
          perPage: $perPage
          query: $query
          restaurantId: $restaurantId
        ) {
          collection {
            email
            name
            phoneNumber
          }
        }
      }
    GQL
  end

  def customer_create_string
    <<~GQL
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input)
      }
    GQL
  end
end
