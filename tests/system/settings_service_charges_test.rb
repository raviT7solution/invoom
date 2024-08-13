# frozen_string_literal: true

require "application_system_test_case"

class SettingsServiceChargesTest < ApplicationSystemTestCase
  test "create" do
    admin = create(:admin)
    restaurant = create(:restaurant, country: "CA", province: "ON")
    admin.restaurants = [restaurant]
    tax = create(:tax, display_name: "GST 5%", country: "CA", province: "ON")

    sign_in(admin)

    visit path_for(:frontend, "/settings/restaurant-settings")
    find(".ant-tabs-tab", text: "Service Charge").click
    wait_for_pending_requests

    click_on "Add Charge"

    within ".ant-drawer" do
      fill_in "Name", with: "Service Charge"
      within ".ant-form-item", text: "Charge Type" do
        fill_in_select with: "Percentage"
      end
      fill_in "Value", with: 10
      within ".ant-form-item", text: "Tax" do
        fill_in_select with: "GST 5%"
      end
      within ".ant-form-item", text: "Visible" do
        find(".ant-checkbox-wrapper", text: "Visible").click
      end

      click_on "Submit"
      wait_for_pending_requests
    end

    service_charge = restaurant.service_charges.last!

    assert_attributes service_charge, \
                      charge_type: "percentage",
                      name: "Service Charge",
                      tax_id: tax.id,
                      value: 10,
                      visible: false
  end

  test "delete" do
    admin = create(:admin)
    restaurant = create(:restaurant, country: "CA", province: "ON")
    admin.restaurants = [restaurant]
    tax = create(:tax, display_name: "GST 5%", country: "CA", province: "ON")

    service_charge = create(:service_charge, restaurant: restaurant, tax: tax)

    sign_in(admin)

    visit path_for(:frontend, "/settings/restaurant-settings")
    find(".ant-tabs-tab", text: "Service Charge").click
    wait_for_pending_requests

    assert_text service_charge.name

    find(".anticon-delete").click

    within ".ant-popover" do
      click_on "OK"
      wait_for_pending_requests
    end

    assert_equal 0, restaurant.service_charges.count
    assert_no_text service_charge.name
  end

  test "update" do
    admin = create(:admin)
    restaurant = create(:restaurant, country: "CA", province: "ON")
    admin.restaurants = [restaurant]
    tax = create(:tax, display_name: "GST 5%", country: "CA", province: "ON")

    service_charge = create(:service_charge, restaurant: restaurant, tax: tax, visible: false)

    sign_in(admin)

    visit path_for(:frontend, "/settings/restaurant-settings")
    find(".ant-tabs-tab", text: "Service Charge").click
    wait_for_pending_requests

    assert_text service_charge.name

    find(".anticon-edit").click

    within ".ant-drawer" do
      fill_in "Name", with: "Service Charge"
      within ".ant-form-item", text: "Charge Type" do
        fill_in_select with: "Percentage"
      end
      fill_in "Value", with: 10
      within ".ant-form-item", text: "Visible" do
        find(".ant-checkbox-wrapper", text: "Visible").click
      end

      click_on "Submit"
      wait_for_pending_requests
    end

    assert_no_text service_charge.name

    service_charge.reload

    assert_attributes service_charge, \
                      charge_type: "percentage",
                      name: "Service Charge",
                      tax_id: tax.id,
                      value: 10,
                      visible: true
  end
end
