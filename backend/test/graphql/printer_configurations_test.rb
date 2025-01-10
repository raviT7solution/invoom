# frozen_string_literal: true

require "test_helper"

class PrinterConfigurationsTest < ActionDispatch::IntegrationTest
  test "ticket_id filter" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    customer = create(:customer, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "takeout", customer: customer)

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))

    ticket = create(:ticket, booking: booking)
    ticket_item = create(:ticket_item, ticket: ticket, item: item)

    printer_configuration = create(:printer_configuration, restaurant: restaurant)
    kitchen_profile = create(:kitchen_profile, restaurant: restaurant, printer_configuration: printer_configuration)
    create(:kitchen_profile_category, kitchen_profile: kitchen_profile, category: category)

    authentic_query user, "mobile_user", printer_configurations, variables: {
      restaurantId: restaurant.id,
      ticketId: ticket.id
    }

    assert_query_success
    assert_equal printer_configuration.id, response.parsed_body["data"]["printerConfigurations"][0]["id"]
    assert_equal ticket_item.id, response.parsed_body["data"]["printerConfigurations"][0]["ticketItems"][0]["id"]
  end

  private

  def printer_configurations
    <<~GQL
      query printerConfigurations($restaurantId: ID!, $ticketId: ID) {
        printerConfigurations(restaurantId: $restaurantId, ticketId: $ticketId) {
          id
          ticketItems {
            id
          }
        }
      }
    GQL
  end
end
