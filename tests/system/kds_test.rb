# frozen_string_literal: true

require "application_system_test_case"

class KdsTest < ApplicationSystemTestCase
  test "ticket status update" do
    restaurant = create(:restaurant, name: "Restaurant 1")
    kds_admin = create(:admin, restaurants: [restaurant])
    user = create(:user, restaurant: restaurant)

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))
    kitchen_profile = create(:kitchen_profile, name: "Kitchen Profile 1", restaurant: restaurant)
    create(:kitchen_profile_category, kitchen_profile: kitchen_profile, category: category)

    table = create(:floor_object, :rectangular_table, restaurant: restaurant, name: "T1")
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2,
                               booking_tables: [build(:booking_table, floor_object: table, name: table.name)])
    ticket = create(:ticket, booking: booking)
    ticket_item = create(:ticket_item, ticket: ticket, item: item, status: :queued)
    another_ticket_item = create(:ticket_item, ticket: ticket, item: item, status: :queued)

    kds_sign_in(kds_admin, restaurant, kitchen_profile)

    visit path_for(:frontend, "/kds")
    wait_for_pending_requests

    find("b", text: "T1").tap do |i|
      i.click
      sleep 0.1
      i.click
    end

    wait_for_pending_requests

    assert_equal "preparing", ticket_item.reload.status
    assert_equal "preparing", another_ticket_item.reload.status

    find("b", text: "T1").click(delay: 3)

    wait_for_pending_requests

    assert_equal "queued", ticket_item.reload.status
    assert_equal "queued", another_ticket_item.reload.status
  end

  test "ticket item status update" do
    restaurant = create(:restaurant, name: "Restaurant 1")
    kds_admin = create(:admin, restaurants: [restaurant])
    user = create(:user, restaurant: restaurant)

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))
    kitchen_profile = create(:kitchen_profile, name: "Kitchen Profile 1", restaurant: restaurant)
    create(:kitchen_profile_category, kitchen_profile: kitchen_profile, category: category)

    table = create(:floor_object, :rectangular_table, restaurant: restaurant, name: "T1")
    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2,
                               booking_tables: [build(:booking_table, floor_object: table, name: table.name)])
    ticket = create(:ticket, booking: booking)
    ticket_item = create(:ticket_item, ticket: ticket, item: item, status: :queued, display_name: "Item 1")

    kds_sign_in(kds_admin, restaurant, kitchen_profile)

    visit path_for(:frontend, "/kds")
    wait_for_pending_requests

    find(".ant-tree-title", text: "Item 1").tap do |i|
      i.click
      sleep 0.1
      i.click
    end

    wait_for_pending_requests

    assert_equal "preparing", ticket_item.reload.status

    find("b", text: "T1").click(delay: 3)

    wait_for_pending_requests

    assert_equal "queued", ticket_item.reload.status
  end
end
