# frozen_string_literal: true

require "application_system_test_case"

class SettingsRestaurantsTest < ApplicationSystemTestCase
  test "create restaurants" do
    admin = create(:admin)

    sign_in(admin)

    visit path_for(:frontend, "/settings/restaurants")

    assert_text "In Progress (0)"
    assert_text "Active (0)"

    click_on "Add Restaurant"

    within ".ant-drawer" do
      wait_for_pending_requests

      within ".ant-list-item", text: "Cafe" do
        find(".ant-checkbox").click
      end

      click_on "Next"

      fill_in "Restaurant Name", with: "Cafe 1"
      fill_in "Email", with: "cafe@example.com"
      fill_in "Phone Number", with: "1111111111"
      within ".ant-form-item", text: "Operational Since" do
        fill_in_select with: Date.current.year.to_s
      end
      fill_in "Taxpayer Identification Number", with: "123456789"
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
      fill_in "Postal Code", with: "15721"
      within ".ant-form-item", text: "Business Start Time" do
        fill_in_ant_picker with: "09:00:00"
      end
      within ".ant-form-item", text: "Business End Time" do
        fill_in_ant_picker with: "23:00:00"
      end
      within ".ant-form-item", text: "Break Start Time" do
        fill_in_ant_picker with: "14:00:00"
      end
      within ".ant-form-item", text: "Break End Time" do
        fill_in_ant_picker with: "14:30:00"
      end

      click_on "Submit"
    end

    wait_for_pending_requests

    assert_attributes admin.restaurants.last!, \
                      address: "837 Auer Divide",
                      city: "Brampton",
                      country: "CA",
                      email: "cafe@example.com",
                      name: "Cafe 1",
                      operational_since: Date.current.year.to_s,
                      phone_number: "1111111111",
                      postal_code: "15721",
                      province: "ON",
                      restaurant_type: "Cafe",
                      status: "pending",
                      taxpayer_id: "123456789",
                      timezone: "America/Toronto",
                      website: "example.com"

    assert_equal Time.parse("2000-01-01T09:00:00Z"), admin.restaurants.last!.business_start_time
    assert_equal Time.parse("2000-01-01T23:00:00Z"), admin.restaurants.last!.business_end_time
    assert_equal Time.parse("2000-01-01T14:00:00Z"), admin.restaurants.last!.break_start_time
    assert_equal Time.parse("2000-01-01T14:30:00Z"), admin.restaurants.last!.break_end_time

    assert_text "In Progress (1)"
    assert_text "Active (0)"
    assert_text "Cafe 1"
  end
end
