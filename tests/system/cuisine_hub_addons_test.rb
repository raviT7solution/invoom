# frozen_string_literal: true

require "application_system_test_case"

class CuisineHubAddonsTest < ApplicationSystemTestCase
  test "create" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/addons")
    wait_for_pending_requests

    click_on "Add Addons"

    within ".ant-drawer" do
      fill_in "Name", with: "Extra cheese"
      fill_in "Price", with: 10
      fill_in "Takeout Price", with: 10.5
      fill_in "Delivery Price", with: 11

      click_on "Submit"
    end

    addon = restaurant.addons.last!

    assert_attributes addon, name: "Extra cheese", price: 10, takeout_price: 10.5, delivery_price: 11, visible: true
  end

  test "delete" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    addon = create(:addon, restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/addons")
    wait_for_pending_requests

    assert_text addon.name

    find(".anticon-delete").click

    within ".ant-popover" do
      click_on "OK"
      wait_for_pending_requests
    end

    assert_equal 0, restaurant.addons.count
    assert_no_text addon.name
  end

  test "update" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    addon = create(:addon, restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/addons")
    wait_for_pending_requests

    assert_text addon.name

    find(".anticon-edit").click

    within ".ant-drawer" do
      fill_in "Name", with: "Extra cheese"
      fill_in "Price", with: 10
      fill_in "Takeout Price", with: 10.5
      fill_in "Delivery Price", with: 11

      find(".ant-checkbox").click

      click_on "Submit"
      wait_for_pending_requests
    end

    assert_no_text addon.name

    addon.reload

    assert_attributes addon, name: "Extra cheese", price: 10, takeout_price: 10.5, delivery_price: 11, visible: false
  end
end
