# frozen_string_literal: true

require "application_system_test_case"

class SettingsRestaurantsTest < ApplicationSystemTestCase
  test "create restaurants" do
    admin = create(:admin)
    tz = "America/Toronto"

    sign_in(admin)

    visit path_for(:frontend, "/settings/restaurants")

    assert_text "In progress (0)"
    assert_text "Active (0)"

    click_on "Add restaurant"

    within ".ant-drawer" do
      wait_for_pending_requests

      within ".ant-form-item", text: "Restaurant type" do
        fill_in with: "Cafe"
        fill_in_select with: "Cafe\nConquer the rush, maximize margins, and boost loyalty with a powerful cafe POS."
      end
      fill_in "Restaurant name", with: "Cafe 1"
      fill_in "Email", with: "cafe@example.com"
      within ".ant-form-item", text: "Phone number" do
        fill_in_select with: "+1"
      end
      fill_in "Phone number", with: "2015550123"
      within ".ant-form-item", text: "Operational since" do
        fill_in_select with: Date.current.year.to_s
      end
      fill_in "Taxpayer identification number", with: "123456789"
      fill_in "Website", with: "example.com"
      within ".ant-form-item", text: "Country" do
        fill_in with: "Canada"
        fill_in_select with: "Canada"
      end
      within ".ant-form-item", text: "Province" do
        fill_in with: "Ontario"
        fill_in_select with: "Ontario"
      end
      within ".ant-form-item", text: "City" do
        fill_in with: "Brampton"
        fill_in_select with: "Brampton"
      end
      within ".ant-form-item", text: "Timezone" do
        zone = Country["CA"].timezones.zones.find { |z| z.name == "America/Toronto" }

        fill_in with: "Toronto"
        fill_in_select with: "#{zone.identifier} (UTC #{zone.strftime('%:z')})"
      end
      fill_in "Address", with: "837 Auer Divide"
      fill_in "Postal code", with: "15721"
      within ".ant-form-item", text: "Business start time" do
        fill_in_ant_picker with: "09:00 AM"
      end
      within ".ant-form-item", text: "Business end time" do
        fill_in_ant_picker with: "11:00 PM"
      end
      within ".ant-form-item", text: "Break start time" do
        fill_in_ant_picker with: "02:00 PM"
      end
      within ".ant-form-item", text: "Break end time" do
        fill_in_ant_picker with: "02:30 PM"
      end

      click_on "Submit"
    end

    wait_for_pending_requests

    assert_attributes admin.restaurants.last!,
                      address: "837 Auer Divide",
                      city: "Brampton",
                      country: "CA",
                      email: "cafe@example.com",
                      name: "Cafe 1",
                      operational_since: Date.current.year.to_s,
                      phone_number: "+12015550123",
                      postal_code: "15721",
                      province: "ON",
                      restaurant_type: "Cafe",
                      status: "pending",
                      taxpayer_id: "123456789",
                      timezone: tz,
                      website: "example.com"

    assert_equal "09:00 AM", admin.restaurants.last!.business_start_time.in_time_zone(tz).strftime("%I:%M %p")
    assert_equal "11:00 PM", admin.restaurants.last!.business_end_time.in_time_zone(tz).strftime("%I:%M %p")
    assert_equal "02:00 PM", admin.restaurants.last!.break_start_time.in_time_zone(tz).strftime("%I:%M %p")
    assert_equal "02:30 PM", admin.restaurants.last!.break_end_time.in_time_zone(tz).strftime("%I:%M %p")

    assert_attributes admin.restaurants.last!.receipt_configuration,
                      show_customer_details: true,
                      show_discount: true,
                      show_platform_branding: true,
                      show_unit_price: true

    assert_text "In progress (1)"
    assert_text "Active (0)"
    assert_text "Cafe 1"
  end
end
