# frozen_string_literal: true

require "application_system_test_case"

class KdsLoginTest < ApplicationSystemTestCase
  test "valid credentials" do
    restaurant = create(:restaurant, name: "Restaurant 1")
    kds_admin = create(:admin, restaurants: [restaurant])
    user = create(:user, restaurant: restaurant)

    category = create(:category, restaurant: restaurant)
    item = create(:item, restaurant: restaurant, category: category, tax: create(:tax))
    kitchen_profile = create(:kitchen_profile, name: "Kitchen Profile 1", restaurant: restaurant)
    create(:kitchen_profile_category, kitchen_profile: kitchen_profile, category: category)

    booking = create(:booking, restaurant: restaurant, user: user, booking_type: "dine_in", pax: 2, table_names: ["T1"])
    ticket = create(:ticket, booking: booking)
    create(:ticket_item, ticket: ticket, item: item, status: :queued)

    visit path_for(:frontend, "/kds/login")

    assert_selector ".ant-card-head-title", text: "KDS Login"

    fill_in "Email", with: kds_admin.email
    fill_in "Password", with: kds_admin.password

    click_on "Login"

    wait_for_pending_requests

    within ".ant-modal" do
      within ".ant-form-item", text: "Restaurant" do
        fill_in_select with: "Restaurant 1"
      end
      within ".ant-form-item", text: "Kitchen profile" do
        fill_in_select with: "Kitchen Profile 1"
      end
      click_on "OK"
    end

    wait_for_pending_requests

    assert_selector "b", text: "T1"
  end

  test "non admin can't login" do
    user = create(:user, restaurant: create(:restaurant))

    visit path_for(:frontend, "/kds/login")

    assert_selector ".ant-card-head-title", text: "KDS Login"

    fill_in "Email", with: user.email
    fill_in "Password", with: user.password

    click_on "Login"

    assert_content "Admin not found"
  end

  test "invalid credentials" do
    kds_admin = create(:admin)

    visit path_for(:frontend, "/kds/login")

    assert_selector ".ant-card-head-title", text: "KDS Login"

    fill_in "Email", with: kds_admin.email
    fill_in "Password", with: "wrong"

    click_on "Login"

    assert_content "Invalid password"
  end
end
