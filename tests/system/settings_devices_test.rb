# frozen_string_literal: true

require "application_system_test_case"

class SettingsDevicesTest < ApplicationSystemTestCase
  test "delete" do
    restaurant = create(:restaurant)
    admin = create(:admin, restaurants: [restaurant])

    create(:device, name: "Device 1", restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/settings/devices")

    wait_for_pending_requests

    assert_selector "tr", text: "Device 1"

    within "tr", text: "Device 1" do
      find(".anticon-delete").click
    end

    within ".ant-popover" do
      click_on "OK"

      wait_for_pending_requests
    end

    assert_equal 0, Device.count
  end

  test "update" do
    restaurant = create(:restaurant)
    admin = create(:admin, restaurants: [restaurant])

    device = create(:device, name: "Device 1", restaurant: restaurant)

    sign_in(admin)

    visit path_for(:frontend, "/settings/devices")

    assert_selector "tr", text: "Device 1"

    within "tr", text: "Device 1" do
      find(".anticon-edit").click
    end

    within ".ant-drawer" do
      fill_in "Name", with: "Device 2"

      click_on "Submit"

      wait_for_pending_requests
    end

    assert_attributes device.reload,
                      fingerprint: device.fingerprint,
                      name: "Device 2",
                      restaurant_id: restaurant.id
  end
end
