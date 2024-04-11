# frozen_string_literal: true

require "test_helper"

class TicketsTest < ActionDispatch::IntegrationTest
  test "ticket create" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    table = create(:floor_object, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", booking_tables: [
                       build(:booking_table, floor_object: table)
                     ])

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, price: 5)
    addon = create(:addon, restaurant: restaurant, items: [item], price: 7)

    authentic_query user, "mobile_user", ticket_create_string, variables: {
      input: {
        bookingId: booking.id,
        attributes: [
          {
            itemId: item.id,
            addonIds: [addon.id],
            modifiers: ["No cheese"],
            quantity: 2,
            note: "No ice"
          }
        ]
      }
    }

    assert_query_success
    assert response.parsed_body["data"]["ticketCreate"]
    assert_attributes Ticket.last, booking: booking
    assert_attributes Ticket.last.ticket_items.first!,
                      name: item.name,
                      note: "No ice",
                      price: 5,
                      quantity: 2,
                      status: "queued"
  end

  private

  def ticket_create_string
    <<~GQL
      mutation ticketCreate($input: TicketCreateInput!) {
        ticketCreate(input: $input)
      }
    GQL
  end
end
