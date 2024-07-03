# frozen_string_literal: true

require "test_helper"

class InvoicesTest < ActionDispatch::IntegrationTest
  test "invoice create" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2,
                               booking_tables: [build(:booking_table, floor_object: table)])
    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, price: 5, tax: create(:tax))

    ticket = create(:ticket, booking: booking)
    ticket_item = create(:ticket_item, ticket: ticket, name: item.name, price: item.price, quantity: 2,
                                       status: "queued", item: item)
    another_ticket_item = create(:ticket_item, ticket: ticket, name: item.name, price: item.price, quantity: 2,
                                               status: "queued", item: item)

    authentic_query user, "mobile_user", invoices_create, variables: {
      input: {
        bookingId: booking.id,
        attributes: [
          {
            total: 12,
            invTotal: 12,
            invoiceType: "simple",
            invoiceItems: [
              {
                quantity: ticket_item.quantity,
                consumeBill: 1,
                ticketItemId: ticket_item.id
              },
              {
                quantity: another_ticket_item.quantity,
                consumeBill: 1,
                ticketItemId: another_ticket_item.id
              }
            ]
          }
        ]
      }
    }

    assert_query_success
    assert response.parsed_body["data"]["invoicesCreate"]
    assert_attributes Invoice.last, booking: booking
    assert_attributes Invoice.last.invoice_items.first!,
                      consume_bill: 1,
                      quantity: ticket_item.quantity
  end

  private

  def invoices_create
    <<~GQL
      mutation invoicesCreate($input: InvoicesCreateInput!) {
        invoicesCreate(input: $input)
      }
    GQL
  end
end
