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
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))
    ticket = create(:ticket, booking: booking)
    ticket_item = create(:ticket_item, ticket: ticket, name: item.name, price: item.price, quantity: 2,
                                       status: "queued", item: item)
    another_ticket_item = create(:ticket_item, ticket: ticket, name: item.name, price: item.price, quantity: 2,
                                               status: "queued", item: item)

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

  test "delete queued ticket item" do
    restaurant = create(:restaurant, pin: "1234")

    role = create(:role, permissions: ["orders", "delete_ticket_item"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])
    customer = create(:customer, restaurant: restaurant)

    category = create(:category, restaurant: restaurant)
    item = create(:item, category: category, restaurant: restaurant, tax: create(:tax))

    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "takeout", customer: customer)

    ticket = create(:ticket, booking: booking)
    ticket_item = create(:ticket_item, ticket: ticket, item: item, status: :queued)

    authentic_query user, "mobile_user", ticket_item_delete_string, variables: {
      input: {
        id: ticket_item.id
      }
    }

    assert_query_success
    assert_empty TicketItem.where(id: ticket_item.id)

    another_role = create(:role, permissions: ["orders"], restaurant: restaurant)
    another_user = create(:user, restaurant: restaurant, roles: [another_role], pin: "9999")

    another_ticket_item = create(:ticket_item, ticket: ticket, item: item, status: :queued)

    authentic_query another_user, "mobile_user", ticket_item_delete_string, variables: {
      input: {
        id: another_ticket_item.id
      }
    }

    assert_query_error "Invalid pin"
    assert TicketItem.exists?(id: another_ticket_item.id)

    authentic_query another_user, "mobile_user", ticket_item_delete_string, variables: {
      input: {
        id: another_ticket_item.id,
        operationPin: "1234"
      }
    }

    assert_query_success
    assert_empty TicketItem.where(id: another_ticket_item.id)
  end

  test "delete not queued ticket item" do
    restaurant = create(:restaurant, pin: "1234")

    role = create(:role, permissions: ["orders", "delete_ticket_item"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])
    customer = create(:customer, restaurant: restaurant)

    category = create(:category, restaurant: restaurant)
    item = create(:item, category: category, restaurant: restaurant, tax: create(:tax))

    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "takeout", customer: customer)

    ticket = create(:ticket, booking: booking)
    ticket_item = create(:ticket_item, ticket: ticket, item: item, status: :preparing)

    authentic_query user, "mobile_user", ticket_item_delete_string, variables: {
      input: {
        id: ticket_item.id
      }
    }

    assert_query_error "Invalid pin"
    assert TicketItem.exists?(id: ticket_item.id)

    authentic_query user, "mobile_user", ticket_item_delete_string, variables: {
      input: {
        id: ticket_item.id,
        operationPin: "1234"
      }
    }

    assert_query_success
    assert_equal "cancelled", ticket_item.reload.status
  end

  private

  def ticket_items_update_string
    <<~GQL
      mutation ticketItemsUpdate($input: TicketItemsUpdateInput!){
        ticketItemsUpdate(input: $input)
      }
    GQL
  end

  def ticket_item_delete_string
    <<~GQL
      mutation ticketItemDelete($input: TicketItemDeleteInput!){
        ticketItemDelete(input: $input)
      }
    GQL
  end
end
