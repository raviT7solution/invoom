# frozen_string_literal: true

require "test_helper"

class CustomersTest < ActionDispatch::IntegrationTest
  test "create customer" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["takeout"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    authentic_query mobile_user_token(user, device), customer_create, variables: {
      input: {
        restaurantId: restaurant.id,
        attributes: {
          countryCode: "+1",
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
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["takeout"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])
    customer = create(:customer, email: "elvis@example.com", name: "Elvis", restaurant: restaurant)
    create(:customer, email: "erika@example.com", name: "Erika", restaurant: restaurant)

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))

    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "takeout", pax: 1, customer: customer)

    ticket = create(:ticket, booking: booking)
    ticket_item1, ticket_item2 = create_list(
      :ticket_item,
      2,
      cst: 0,
      gst: 0,
      hst: 0,
      item: item,
      pst: 0,
      qst: 0,
      rst: 0,
      status: "queued",
      ticket: ticket
    )

    invoice1 = create(:invoice, booking: booking)
    invoice2 = create(:invoice, booking: booking)

    create(:invoice_item, ticket_item: ticket_item1, invoice: invoice1, price: 100)
    create(:invoice_item, ticket_item: ticket_item2, invoice: invoice2, price: 50)

    authentic_query mobile_user_token(user, device), index_string,
                    variables: { restaurantId: restaurant.id, query: "El", page: 1, perPage: 10 }

    assert_query_success
    assert_equal [
      {
        "avgInvoiceAmount" => 75.0,
        "email" => "elvis@example.com",
        "invoiceCount" => 2,
        "name" => "Elvis",
        "phoneNumber" => customer.phone_number,
        "totalInvoiceAmount" => 150.0
      }
    ], response.parsed_body["data"]["customers"]["collection"]
  end

  test "customers export" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["takeout"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    create(:customer, restaurant: restaurant)
    create(:customer, restaurant: restaurant)

    authentic_query mobile_user_token(user, device), index_string, variables: {
      export: true,
      page: 0,
      perPage: 0,
      restaurantId: restaurant.id
    }

    assert_query_success
    assert_equal 2, response.parsed_body["data"]["customers"]["collection"].length
  end

  test "update customer" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["takeout"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])
    customer = create(:customer, restaurant: restaurant)

    authentic_query mobile_user_token(user, device), customer_update, variables: {
      input: {
        attributes: {
          email: "elvis@example.com",
          name: "Elvis",
          phoneNumber: "1234"
        },
        id: customer.id
      }
    }

    assert_query_success
    assert_attributes customer.reload,
                      email: "elvis@example.com",
                      name: "Elvis",
                      phone_number: "1234"
  end

  private

  def index_string
    <<~GQL
      query customers(
        $export: Boolean
        $page: Int!
        $perPage: Int!
        $query: String
        $restaurantId: ID!
      ) {
        customers(
          export: $export
          page: $page
          perPage: $perPage
          query: $query
          restaurantId: $restaurantId
        ) {
          collection {
            avgInvoiceAmount
            email
            invoiceCount
            name
            phoneNumber
            totalInvoiceAmount
          }
        }
      }
    GQL
  end

  def customer_create
    <<~GQL
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input)
      }
    GQL
  end

  def customer_update
    <<~GQL
      mutation customerUpdate($input: CustomerUpdateInput!) {
        customerUpdate(input: $input)
      }
    GQL
  end
end
