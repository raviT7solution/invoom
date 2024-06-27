# frozen_string_literal: true

require "application_system_test_case"

class SettingsKitchenProfilesTest < ApplicationSystemTestCase
  test "create" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    category = create(:category, restaurant: restaurant, name: "Category 1")

    sign_in(admin)

    visit path_for(:frontend, "/settings/kitchen-profiles")

    click_on "Add Kitchen Profile"

    within ".ant-drawer" do
      fill_in "Name", with: "Kitchen Profile 1"
      within ".ant-form-item", text: "Categories" do
        fill_in_select with: "Category 1"
      end
      within ".ant-form-item", text: "Rows" do
        find(".ant-slider-mark-text", text: "2").click
      end
      within ".ant-form-item", text: "Columns" do
        find(".ant-slider-mark-text", text: "3").click
      end

      click_on "Submit"
    end

    wait_for_pending_requests

    assert_selector ".ant-list-item", text: "Kitchen Profile 1"

    kitchen_profile = KitchenProfile.last

    assert_attributes kitchen_profile,
                      category_ids: [category.id],
                      columns: 3,
                      name: "Kitchen Profile 1",
                      notify: true,
                      rows: 2
  end

  test "delete" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    create(:kitchen_profile, name: "Kitchen Profile 1", restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/settings/kitchen-profiles")

    assert_selector ".ant-list-item", text: "Kitchen Profile 1"

    within ".ant-list-item", text: "Kitchen Profile 1" do
      find(".anticon-delete").click
    end
    within ".ant-popover-content" do
      click_on "OK"
    end

    wait_for_pending_requests

    assert_equal 0, restaurant.kitchen_profiles.count
  end

  test "update" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    category = create(:category, restaurant: restaurant, name: "Category 1")

    kitchen_profile = create(:kitchen_profile, name: "Kitchen Profile 1", restaurant: restaurant, rows: 2, columns: 3)
    create(:kitchen_profile_category, kitchen_profile: kitchen_profile, category: category)

    sign_in(admin)

    visit path_for(:frontend, "/settings/kitchen-profiles")

    assert_selector ".ant-list-item", text: "Kitchen Profile 1"

    within ".ant-list-item", text: "Kitchen Profile 1" do
      find(".anticon-edit").click
    end

    within ".ant-drawer" do
      fill_in "Name", with: "Kitchen Profile Updated"
      within ".ant-form-item", text: "Rows" do
        find(".ant-slider-mark-text", text: "3").click
      end
      within ".ant-form-item", text: "Columns" do
        find(".ant-slider-mark-text", text: "4").click
      end

      click_on "Submit"
    end

    wait_for_pending_requests

    kitchen_profile.reload

    assert_attributes kitchen_profile,
                      category_ids: [category.id],
                      columns: 4,
                      name: "Kitchen Profile Updated",
                      notify: true,
                      rows: 3
  end
end
