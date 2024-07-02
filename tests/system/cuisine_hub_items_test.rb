# frozen_string_literal: true

require "application_system_test_case"

class CuisineHubItemsTest < ApplicationSystemTestCase
  test "create" do
    admin = create(:admin)
    restaurant = create(:restaurant, country: "CA", province: "ON")
    admin.restaurants = [restaurant]

    category = create(:category, name: "Sandwich", restaurant: restaurant)
    modifier = create(:modifier, name: "Jain", restaurant: restaurant)
    tax = create(:tax, display_name: "GST 5%", country: "CA", province: "ON")

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/items")
    wait_for_pending_requests

    click_on "Add Item"

    within ".ant-drawer" do
      fill_in "Name", with: "Vadapav"
      fill_in "Display Name", with: "Vadapav"
      within ".ant-form-item", text: "Category" do
        fill_in_select with: "Sandwich"
      end
      within ".ant-form-item", text: "Tax" do
        fill_in_select with: "GST 5%"
      end
      within ".ant-form-item", text: "Modifiers" do
        fill_in_select with: "Jain"
      end
      fill_in "Cost Of Production", with: 10
      fill_in "Price", with: 11
      fill_in "Takeout Price", with: 12
      fill_in "Delivery Price", with: 13

      click_on "Submit"
    end

    item = restaurant.items.last!

    assert_attributes item,
                      category_id: category.id,
                      cost_of_production: 10,
                      delivery_price: 13,
                      description: "",
                      display_name: "Vadapav",
                      eq_price: false,
                      modifier_ids: [modifier.id],
                      name: "Vadapav",
                      price: 11,
                      takeout_price: 12,
                      tax_id: tax.id,
                      visible: true
  end

  test "delete" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    category = create(:category, restaurant: restaurant)
    item = create(:item, category: category, restaurant: restaurant, tax: create(:tax))

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/items")
    wait_for_pending_requests

    assert_text item.name

    find(".anticon-delete").click

    within ".ant-popover" do
      click_on "OK"
      wait_for_pending_requests
    end

    assert_equal 0, restaurant.items.count
    assert_no_text item.name
  end

  test "update" do
    admin = create(:admin)
    restaurant = create(:restaurant, country: "CA", province: "ON")
    admin.restaurants = [restaurant]

    category = create(:category, name: "Sandwich", restaurant: restaurant)
    modifier = create(:modifier, name: "Jain", restaurant: restaurant)
    tax = create(:tax, display_name: "GST 5%", country: "CA", province: "ON")

    item = create(:item, category: create(:category, restaurant: restaurant), restaurant: restaurant, tax: tax)

    sign_in(admin)

    visit path_for(:frontend, "/cuisine-hub/items")
    wait_for_pending_requests

    assert_text item.name

    find(".anticon-edit").click

    within ".ant-drawer" do
      fill_in "Name", with: "Vadapav"
      fill_in "Description", with: "-"
      within ".ant-form-item", text: "Category" do
        fill_in_select with: "Sandwich"
      end
      within ".ant-form-item", text: "Modifiers" do
        fill_in_select with: "Jain"
      end
      find(".ant-checkbox-wrapper", text: "Visible").click

      click_on "Submit"
      wait_for_pending_requests
    end

    assert_no_text item.name

    item.reload

    assert_attributes item,
                      category_id: category.id,
                      description: "-",
                      eq_price: false,
                      modifier_ids: [modifier.id],
                      name: "Vadapav",
                      visible: false
  end
end
