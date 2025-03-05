# frozen_string_literal: true

require "application_system_test_case"

class CfdTest < ApplicationSystemTestCase
  test "show invoice" do
    restaurant = create(:restaurant)
    admin = create(:admin, restaurants: [restaurant])
    user = create(:user, restaurant: restaurant)
    device = create(:device, restaurant: restaurant)

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))

    customer = create(:customer, restaurant: restaurant)
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "takeout", customer: customer)

    ticket = create(:ticket, booking: booking)
    ticket_item = create(:ticket_item, ticket: ticket, item: item)

    invoice = create(:invoice, booking: booking)
    create(:invoice_item, ticket_item: ticket_item, invoice: invoice)

    cfd_sign_in(admin, restaurant, device)

    visit path_for(:frontend, "/cfd")

    wait_for_pending_requests
    sleep 1

    CustomerFacingDisplayChannel.broadcast_to(device, { invoice_id: invoice.id })

    assert_text "Checkout"

    wait_for_pending_requests

    assert_selector "span", text: ticket_item.name
    assert_selector "span", text: "$#{invoice.invoice_summary.total.round(2)}"

    CustomerFacingDisplayChannel.broadcast_to(device, { invoice_id: "" })

    wait_for_pending_requests

    assert_no_text "Checkout"
  end
end
