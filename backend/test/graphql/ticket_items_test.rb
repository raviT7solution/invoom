# frozen_string_literal: true

require "test_helper"

class TicketItemsTest < ActionDispatch::IntegrationTest
  test "ticket items update" do
    restaurant = create(:restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    table = create(:floor_object, :rectangular_table, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2,
                               booking_tables: [build(:booking_table, floor_object: table)])

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category)
    ticket = create(:ticket, booking: booking)
    ticket_item = create(:ticket_item, ticket: ticket, name: item.name, price: item.price, quantity: 2,
                                       status: "queued")
    another_ticket_item = create(:ticket_item, ticket: ticket, name: item.name, price: item.price, quantity: 2,
                                               status: "queued")

    authentic_query user, "mobile_user", ticket_items_update_string, variables: {
      input: {
        attributes: [
          {
            id: ticket_item.id,
            status: "preparing"
          }
        ]
      }
    }

    assert_query_success
    assert_attributes ticket_item.reload, status: "preparing"
    assert_attributes another_ticket_item.reload, status: "queued"

    authentic_query user, "mobile_user", ticket_items_update_string, variables: {
      input: {
        attributes: [
          {
            id: ticket_item.id,
            status: "queued"
          },
          {
            id: another_ticket_item.id,
            quantity: nil
          }
        ]
      }
    }

    assert_query_error "Quantity can't be blank"
    assert_attributes ticket_item.reload, status: "preparing", quantity: 2 # as is
    assert_attributes another_ticket_item.reload, status: "queued", quantity: 2 # as is
  end

  private

  def ticket_items_update_string
    <<~GQL
      mutation ticketItemsUpdate($input: TicketItemsUpdateInput!){
        ticketItemsUpdate(input: $input)
      }
    GQL
  end
end
