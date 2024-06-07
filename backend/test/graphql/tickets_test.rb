# frozen_string_literal: true

require "test_helper"

class TicketsTest < ActionDispatch::IntegrationTest
  test "ticket create" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])
    tax = create(:tax)

    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2,
                               booking_tables: [build(:booking_table, floor_object: table)])

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, price: 5, tax: create(:tax))
    addon = create(:addon, restaurant: restaurant, items: [item], price: 7)

    authentic_query user, "mobile_user", ticket_create_string, variables: {
      input: {
        bookingId: booking.id,
        attributes: [
          {
            addonIds: [addon.id],
            itemId: item.id,
            modifiers: ["No cheese"],
            note: "No ice",
            quantity: 2,
            taxId: tax.id
          }
        ]
      }
    }

    assert_query_success
    assert response.parsed_body["data"]["ticketCreate"]
    assert_attributes Ticket.last, booking: booking
    assert_attributes Ticket.last.ticket_items.first!,
                      gst: tax.gst,
                      hst: tax.hst,
                      name: item.name,
                      note: "No ice",
                      price: 5,
                      pst: tax.pst,
                      qst: tax.qst,
                      quantity: 2,
                      rst: tax.rst,
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
