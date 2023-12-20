# frozen_string_literal: true

require "application_system_test_case"

class CuisineHubMenusTest < ApplicationSystemTestCase
  test "create" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/menus")
    wait_for_pending_requests

    click_on "Add Menu"

    within ".ant-drawer" do
      fill_in "Name", with: "Breakfast"

      click_on "Submit"
    end

    menu = restaurant.menus.last!

    assert_attributes menu, name: "Breakfast", description: "", visible: true
  end

  test "delete" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    menu = create(:menu, restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/menus")
    wait_for_pending_requests

    assert_text menu.name

    find(".anticon-delete").click

    within ".ant-popover" do
      click_on "OK"
      wait_for_pending_requests
    end

    assert_equal 0, restaurant.menus.count
    assert_no_text menu.name
  end

  test "update" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    menu = create(:menu, restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/menus")
    wait_for_pending_requests

    assert_text menu.name

    find(".anticon-edit").click

    within ".ant-drawer" do
      fill_in "Name", with: "Breakfast"
      fill_in "Description", with: "-"

      find(".ant-checkbox").click

      click_on "Submit"
      wait_for_pending_requests
    end

    assert_no_text menu.name

    menu.reload

    assert_attributes menu, name: "Breakfast", description: "-", visible: false
  end
end
