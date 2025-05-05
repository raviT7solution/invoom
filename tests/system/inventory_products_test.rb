# frozen_string_literal: true

require "application_system_test_case"

class InventoryProductsTest < ApplicationSystemTestCase
  test "create" do
    admin = create(:admin)
    restaurant = create(:restaurant, country: "CA", province: "ON")
    admin.restaurants = [restaurant]
    category = create(:inventory_category, name: "Fruit", restaurant: restaurant)
    tax = create(:tax, display_name: "GST 5%", country: "CA", province: "ON")

    sign_in(admin)

    visit path_for(:frontend, "/inventory/products")
    wait_for_pending_requests

    click_on "Add product"

    within ".ant-drawer" do
      fill_in "Product name", with: "Egg"
      within ".ant-form-item", text: "Itemcode / Barcode" do
        click_button
        wait_for_pending_requests
      end
      within ".ant-form-item", text: "Category" do
        fill_in_select with: "Fruit"
      end
      within ".ant-form-item", text: "Tax" do
        fill_in_select with: "GST 5%"
      end
      fill_in "Description", with: "This is test"
      fill_in "Price", with: "10"
      within ".ant-form-item", text: "UOM" do
        fill_in_select with: "Tonne"
      end
      fill_in "Quantity / Weight", with: "10"
      fill_in "Reorder point", with: "10"
      fill_in "Stock limit", with: "5"

      click_on "Submit"
    end

    product = restaurant.products.last!

    assert_attributes product, \
                      inventory_category_id: category.id,
                      name: "Egg",
                      price: 10.00,
                      reorder_point: 10.0,
                      stock_limit: 5.0,
                      tax_id: tax.id,
                      uom: "tonne",
                      visible: true,
                      weight: 10.0

    assert_instance_of String, product.item_code
  end

  test "delete" do
    admin = create(:admin)
    restaurant = create(:restaurant, country: "CA", province: "ON")
    admin.restaurants = [restaurant]
    inventory_category = create(:inventory_category, restaurant: restaurant)
    tax = create(:tax, display_name: "GST 5%", country: "CA", province: "ON")
    product = create(:product, restaurant: restaurant, inventory_category: inventory_category, tax: tax)

    sign_in(admin)

    visit path_for(:frontend, "/inventory/products")
    wait_for_pending_requests

    assert_text product.name

    find(".anticon-delete").click

    within ".ant-popover" do
      click_on "OK"
      wait_for_pending_requests
    end

    assert_equal 0, restaurant.products.count
    assert_no_text product.name
  end

  test "update" do
    admin = create(:admin)
    restaurant = create(:restaurant, country: "CA", province: "ON")
    admin.restaurants = [restaurant]
    inventory_category = create(:inventory_category, restaurant: restaurant)
    tax = create(:tax, display_name: "GST 5%", country: "CA", province: "ON")
    product = create(:product, restaurant: restaurant, inventory_category: inventory_category, tax: tax)

    sign_in(admin)

    visit path_for(:frontend, "/inventory/products")
    wait_for_pending_requests

    assert_text product.name

    find(".anticon-edit").click

    within ".ant-drawer" do
      fill_in "Product name", with: "Egg"
      fill_in "Description", with: "This is test"
      fill_in "Price", with: "10"
      within ".ant-form-item", text: "UOM" do
        fill_in_select with: "Tonne"
      end
      fill_in "Quantity / Weight", with: "10"
      fill_in "Reorder point", with: "10"
      fill_in "Stock limit", with: "5"

      find(".ant-checkbox-wrapper-checked", text: "Visible").click

      click_on "Submit"
      wait_for_pending_requests
    end

    assert_no_text product.name

    product.reload

    assert_attributes product, \
                      inventory_category_id: inventory_category.id,
                      item_code: product.item_code,
                      name: "Egg",
                      price: 10.00,
                      reorder_point: 10.0,
                      stock_limit: 5.0,
                      tax_id: tax.id,
                      uom: "tonne",
                      visible: false,
                      weight: 10.0
  end
end
