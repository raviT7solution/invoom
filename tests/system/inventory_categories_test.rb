# frozen_string_literal: true

require "application_system_test_case"

class InventoryCategoriesTest < ApplicationSystemTestCase
  test "create" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    sign_in(admin)

    visit path_for(:frontend, "/inventory/categories")
    wait_for_pending_requests

    click_on "Add Category"

    within ".ant-drawer" do
      fill_in "Name", with: "Fruit"
      fill_in "Description", with: "This is test Fruit"
      click_on "Submit"
    end

    category = restaurant.inventory_categories.last!

    assert_attributes category, description: "This is test Fruit", name: "Fruit", visible: true
  end

  test "delete" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    category = create(:inventory_category, restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/inventory/categories")
    wait_for_pending_requests

    assert_text category.name

    find(".anticon-delete").click

    within ".ant-popover" do
      click_on "OK"
      wait_for_pending_requests
    end

    assert_equal 0, restaurant.categories.count
    assert_no_text category.name
  end

  test "update" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    category = create(:inventory_category, restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/inventory/categories")
    wait_for_pending_requests

    assert_text category.name

    find(".anticon-edit").click

    within ".ant-drawer" do
      fill_in "Name", with: "Fruit"
      fill_in "Description", with: "This is test Fruit"

      find(".ant-checkbox").click

      click_on "Submit"
      wait_for_pending_requests
    end

    assert_no_text category.name

    category.reload

    assert_attributes category, description: "This is test Fruit", name: "Fruit", visible: false
  end
end
