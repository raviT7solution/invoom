# frozen_string_literal: true

require "application_system_test_case"

class CuisineHubModifiersTest < ApplicationSystemTestCase
  test "create" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    category = create(:category, name: "Category 1", restaurant: restaurant)
    item = create(:item, name: "Item 1", category: category, restaurant: restaurant, tax: create(:tax))

    create(:menu_category, category: category, menu: create(:menu, restaurant: restaurant))

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/modifiers")
    wait_for_pending_requests

    click_on "Add modifier"

    within ".ant-drawer" do
      fill_in "Name", with: "Spice"
      fill_in "Options", with: "Low"
      within ".ant-form-item", text: "Categories" do
        fill_in_select with: "Category 1"
      end
      within ".ant-form-item", text: "Items" do
        fill_in_select with: "Item 1"
      end
      click_on "Submit"
    end

    modifier = restaurant.modifiers.last!

    assert_attributes modifier, category_ids: [category.id],
                                global_modifier: false,
                                item_ids: [item.id],
                                multi_select: false,
                                name: "Spice",
                                values: ["Low"],
                                visible: true
  end

  test "delete" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    modifier = create(:modifier, restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/modifiers")
    wait_for_pending_requests

    assert_text modifier.name

    find(".anticon-delete").click

    within ".ant-popover" do
      click_on "OK"
      wait_for_pending_requests
    end

    assert_equal 0, restaurant.modifiers.count
    assert_no_text modifier.name
  end

  test "update" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    category = create(:category, name: "Category 1", restaurant: restaurant)
    item = create(:item, name: "Item 1", category: category, restaurant: restaurant, tax: create(:tax))

    modifier = create(:modifier, restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/modifiers")
    wait_for_pending_requests

    assert_text modifier.name

    find(".anticon-edit").click

    within ".ant-drawer" do
      fill_in "Name", with: "Spice"
      fill_in "Options", with: "Low"
      within ".ant-form-item", text: "Categories" do
        fill_in_select with: "Category 1"
      end
      within ".ant-form-item", text: "Items" do
        fill_in_select with: "Item 1"
      end

      find(".ant-checkbox-wrapper", text: "Visible").click

      click_on "Submit"
      wait_for_pending_requests
    end

    assert_no_text modifier.name

    modifier.reload

    assert_attributes modifier, category_ids: [category.id],
                                global_modifier: false,
                                item_ids: [item.id],
                                multi_select: false,
                                name: "Spice",
                                values: ["Low"],
                                visible: false
  end
end
