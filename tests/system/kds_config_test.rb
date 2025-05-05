# frozen_string_literal: true

require "application_system_test_case"

class KdsConfigTest < ApplicationSystemTestCase
  test "change restaurant" do
    restaurant = create(:restaurant, name: "Restaurant 1")
    another_restaurant = create(:restaurant, name: "Restaurant 2")
    kds_admin = create(:admin, restaurants: [restaurant, another_restaurant])
    kitchen_profile = create(:kitchen_profile, name: "Kitchen Profile 1", restaurant: restaurant)

    kds_sign_in(kds_admin, restaurant, kitchen_profile)

    visit path_for(:frontend, "/kds")
    wait_for_pending_requests

    find(".anticon-menu").click

    within ".ant-drawer" do
      find(".ant-collapse-header", text: "Account").click
      wait_for_pending_requests

      within ".ant-collapse-content-active" do
        fill_in_select with: "Restaurant 2"
      end
    end

    within ".ant-modal" do
      assert_selector ".ant-modal-title", text: "Admin verification"

      fill_in "Email", with: kds_admin.email
      fill_in "Password", with: kds_admin.password

      click_on "Submit"
      wait_for_pending_requests
    end

    within ".ant-drawer" do
      within ".ant-collapse-content-active" do
        assert_text "Restaurant 2"
      end
    end
  end
end
