# frozen_string_literal: true

require "test_helper"

class TicketItemsChannelTest < ActionCable::Channel::TestCase
  test "ticket item status broadcast" do
    restaurant = create(:restaurant)
    device = create(:device, restaurant: restaurant)
    role = create(:role, permissions: ["orders"], restaurant: restaurant)
    user = create(:user, restaurant: restaurant, roles: [role])

    customer = create(:customer, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "takeout", customer: customer)

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))
    ticket = create(:ticket, booking: booking)
    ticket_item = create(:ticket_item, ticket: ticket, status: "queued", item: item)

    subscribe(
      "Authorization" => mobile_user_token(user, device),
      "booking_id" => booking.id
    )

    assert subscription.confirmed?
    assert_has_stream_for booking

    ticket_item.update!(status: :preparing)

    assert_broadcasts booking, 1
  end
end
