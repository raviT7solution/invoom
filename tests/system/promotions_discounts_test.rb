# frozen_string_literal: true

require "application_system_test_case"

class PromotionsDiscountsTest < ApplicationSystemTestCase
  test "create" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]
    category = create(:category, name: "Sandwich", restaurant: restaurant)
    item = create(:item, name: "Veg. Sandwich", category: category, restaurant: restaurant, tax: create(:tax))

    sign_in(admin)

    visit path_for(:frontend, "/promotions/discounts")
    wait_for_pending_requests

    click_on "Add discount"

    within ".ant-drawer" do
      fill_in "Discount name", with: "First"
      within ".ant-form-item", text: "Discount type" do
        fill_in_select with: "Percentage"
      end
      within ".ant-form-item", text: "Channel" do
        fill_in_select with: "Dine-in"
      end
      fill_in "Discount value", with: 10
      fill_in "Threshold", with: 1
      fill_in "Capping", with: 2
      within ".ant-form-item", text: "Discount on" do
        find(".ant-radio-wrapper", text: "Item wise").click
      end
      within ".ant-form-item", text: "Categories" do
        fill_in_select with: "Sandwich"
      end
      within ".ant-form-item", text: "Items" do
        fill_in_select with: "Veg. Sandwich"
      end
      within ".ant-form-item", text: "Auto apply" do
        find(".ant-radio-wrapper", text: "No").click
      end
      within ".ant-form-item", text: "Clubbed" do
        find(".ant-radio-wrapper", text: "Yes").click
      end
      within ".ant-form-item", text: "Visible" do
        find(".ant-checkbox-wrapper", text: "Visible").click
      end

      click_on "Submit"
      wait_for_pending_requests
    end

    discount = restaurant.discounts.last!

    assert_attributes discount, \
                      auto_apply: false,
                      black_out_dates: [],
                      capping: 2,
                      category_ids: [category.id],
                      channels: ["dine_in"],
                      clubbed: true,
                      discount_on: "item_wise",
                      discount_type: "percentage",
                      item_ids: [item.id],
                      name: "First",
                      repeat: [],
                      threshold: 1,
                      value: 10,
                      visible: false
  end

  test "delete" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    discount = create(:discount, restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/promotions/discounts")
    wait_for_pending_requests

    assert_text discount.name

    find(".anticon-delete").click

    within ".ant-popover" do
      click_on "OK"
      wait_for_pending_requests
    end

    assert_equal 0, restaurant.discounts.count
    assert_no_text discount.name
  end

  test "update" do
    admin = create(:admin)
    restaurant = create(:restaurant, timezone: "Asia/Tokyo")
    admin.restaurants = [restaurant]
    category = create(:category, name: "Sandwich", restaurant: restaurant)
    item = create(:item, name: "Veg. Sandwich", category: category, restaurant: restaurant, tax: create(:tax))

    discount = create(:discount, restaurant: restaurant,
                                 channels: ["all"],
                                 discount_on: "item_wise",
                                 category_ids: [category.id],
                                 item_ids: [item.id],
                                 auto_apply: true,
                                 start_date_time: "2024-04-01T11:20:00",
                                 end_date_time: "2024-04-03T11:20:00",
                                 clubbed: false,
                                 repeat: ["Fri"],
                                 visible: false)

    sign_in(admin)

    visit path_for(:frontend, "/promotions/discounts")
    wait_for_pending_requests

    assert_text discount.name

    find(".anticon-edit").click

    within ".ant-drawer" do
      fill_in "Discount name", with: "First"
      within ".ant-form-item", text: "Discount type" do
        fill_in_select with: "Percentage"
      end
      within ".ant-form-item", text: "Channel" do
        fill_in_select with: "Dine-in"
      end
      fill_in "Discount value", with: 10
      fill_in "Threshold", with: 1
      fill_in "Capping", with: 2
      within ".ant-form-item", text: "Discount on" do
        find(".ant-radio-wrapper", text: "Bill wise").click
      end
      within ".ant-form-item", text: "Auto apply" do
        find(".ant-radio-wrapper", text: "Yes").click
      end
      within ".ant-form-item", text: "Start date & time" do
        fill_in_ant_picker with: "02-01-2016 10:00 AM"
      end
      within ".ant-form-item", text: "End date & time" do
        fill_in_ant_picker with: "02-01-2016 06:00 PM"
      end
      within ".ant-form-item", text: "Clubbed" do
        find(".ant-radio-wrapper", text: "Yes").click
      end
      within ".ant-form-item", text: "Repeat" do
        find(".ant-checkbox-wrapper", text: "Sun").click
        find(".ant-checkbox-wrapper", text: "Sat").click
      end
      within ".ant-form-item", text: "Visible" do
        find(".ant-checkbox-wrapper", text: "Visible").click
      end

      click_on "Submit"
      wait_for_pending_requests
    end

    assert_no_text discount.name

    discount.reload

    assert_attributes discount, \
                      auto_apply: true,
                      black_out_dates: [],
                      capping: 2,
                      category_ids: [],
                      channels: ["all", "dine_in"],
                      clubbed: true,
                      discount_on: "bill_wise",
                      discount_type: "percentage",
                      item_ids: [],
                      name: "First",
                      repeat: ["Fri", "Sun", "Sat"],
                      threshold: 1,
                      value: 10,
                      visible: true

    assert_equal "2016-02-01T09:00:00Z", discount.end_date_time.iso8601
    assert_equal "2016-02-01T01:00:00Z", discount.start_date_time.iso8601
  end
end
