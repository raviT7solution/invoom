# frozen_string_literal: true

require "application_system_test_case"

class CuisineHubCategoriesTest < ApplicationSystemTestCase
  test "create" do
    admin = create(:admin)
    restaurant = create(:restaurant, country: "CA", province: "ON")
    admin.restaurants = [restaurant]
    tax = create(:tax, display_name: "GST 5%", country: "CA", province: "ON")

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/menus")
    wait_for_pending_requests

    click_on "Add menu"

    within ".ant-drawer" do
      fill_in "Name", with: "Breakfast"

      click_on "Submit"
    end

    visit path_for(:frontend, "/cuisine-hub/categories")
    wait_for_pending_requests

    click_on "Add category"

    within ".ant-drawer" do
      fill_in "Name", with: "Sandwich"
      within ".ant-form-item", text: "Menu" do
        fill_in_select with: "Breakfast"
      end
      within ".ant-form-item", text: "Tax" do
        fill_in_select with: "GST 5%"
      end

      click_on "Submit"
    end

    category = restaurant.categories.last!

    assert_attributes category, \
                      name: "Sandwich",
                      tax_id: tax.id,
                      visible: true
  end

  test "delete" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    category = create(:category, restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/categories")
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

    category = create(:category, restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/menus")
    wait_for_pending_requests

    click_on "Add menu"

    within ".ant-drawer" do
      fill_in "Name", with: "Breakfast"

      click_on "Submit"
    end

    visit path_for(:frontend, "/cuisine-hub/categories")
    wait_for_pending_requests

    assert_text category.name

    find(".anticon-edit").click

    within ".ant-drawer" do
      fill_in "Name", with: "Sandwich"

      find(".ant-checkbox").click

      within ".ant-form-item", text: "Menu" do
        fill_in_select with: "Breakfast"
      end

      click_on "Submit"
      wait_for_pending_requests
    end

    assert_no_text category.name

    category.reload

    assert_attributes category, name: "Sandwich", visible: false
  end
end
