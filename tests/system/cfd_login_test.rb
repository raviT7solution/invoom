# frozen_string_literal: true

require "application_system_test_case"

class CfdLoginTest < ApplicationSystemTestCase
  test "valid credentials" do
    restaurant = create(:restaurant, name: "Restaurant 1")
    admin = create(:admin, restaurants: [restaurant])

    device = create(:device, restaurant: restaurant)

    visit path_for(:frontend, "/cfd/login")

    assert_selector ".ant-card-head-title", text: "CFD Login"

    fill_in "Email", with: admin.email
    fill_in "Password", with: admin.password

    click_on "Login"

    wait_for_pending_requests

    within ".ant-modal" do
      within ".ant-form-item", text: "Restaurant" do
        fill_in_select with: "Restaurant 1"
      end
      within ".ant-form-item", text: "Device" do
        fill_in_select with: device.name
      end
      click_on "OK"
    end

    wait_for_pending_requests

    assert_selector "img"
  end

  test "non admin can't login" do
    user = create(:user, restaurant: create(:restaurant))

    visit path_for(:frontend, "/cfd/login")

    assert_selector ".ant-card-head-title", text: "CFD Login"

    fill_in "Email", with: user.email
    fill_in "Password", with: user.password

    click_on "Login"

    assert_content "Admin not found"
  end

  test "invalid credentials" do
    admin = create(:admin)

    visit path_for(:frontend, "/cfd/login")

    assert_selector ".ant-card-head-title", text: "CFD Login"

    fill_in "Email", with: admin.email
    fill_in "Password", with: "wrong"

    click_on "Login"

    assert_content "Invalid password"
  end
end
