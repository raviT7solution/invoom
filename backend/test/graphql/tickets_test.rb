# frozen_string_literal: true

require "test_helper"

class TicketsTest < ActionDispatch::IntegrationTest
  test "ticket create" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

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
            quantity: 2
          }
        ]
      }
    }

    assert_query_success
    assert response.parsed_body["data"]["ticketCreate"]
    assert_attributes Ticket.last, booking: booking
    assert_attributes Ticket.last.ticket_items.first!,
                      cst: item.tax.cst,
                      gst: item.tax.gst,
                      hst: item.tax.hst,
                      name: item.name,
                      note: "No ice",
                      price: 5,
                      pst: item.tax.pst,
                      qst: item.tax.qst,
                      quantity: 2,
                      rst: item.tax.rst,
                      status: "queued"
  end

  test "ticket create with negative quantity" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2,
                               booking_tables: [build(:booking_table, floor_object: table)])

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, price: 5, tax: create(:tax))

    ticket = create(:ticket, booking: booking)
    ticket_item = create(:ticket_item, ticket: ticket, item: item, status: :queued)
    ticket_item_addon = create(:ticket_item_addon, ticket_item: ticket_item)

    authentic_query user, "mobile_user", ticket_create_string, variables: {
      input: {
        bookingId: booking.id,
        attributes: [
          {
            addonIds: [ticket_item_addon.id],
            itemId: item.id,
            modifiers: ["No cheese"],
            note: "No ice",
            quantity: -2
          }
        ]
      }
    }

    assert_query_success

    ticket = Ticket.order(:created_at).last!

    assert response.parsed_body["data"]["ticketCreate"]
    assert_attributes ticket, booking: booking
    assert_attributes ticket.ticket_items.first!,
                      cst: item.tax.cst,
                      gst: item.tax.gst,
                      hst: item.tax.hst,
                      name: item.name,
                      note: "No ice",
                      price: 5,
                      pst: item.tax.pst,
                      qst: item.tax.qst,
                      quantity: -2,
                      rst: item.tax.rst,
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
