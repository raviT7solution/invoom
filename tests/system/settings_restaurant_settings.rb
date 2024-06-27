# frozen_string_literal: true

require "application_system_test_case"

class SettingsRestaurantSettingsTest < ApplicationSystemTestCase
  test "taxes" do
    admin = create(:admin)
    restaurant = create(:restaurant, country: "CA", province: "ON")
    admin.restaurants = [restaurant]

    tax = create(:tax, display_name: "PST 5%", category: "meals", country: "CA", province: "ON")
    other_tax = create(:tax, display_name: "GST 5%", category: "meals", country: "IN", province: "GJ")

    sign_in(admin)
    visit path_for(:frontend, "/settings/restaurant-settings")
    wait_for_pending_requests

    assert_text tax.display_name
    assert_no_text other_tax.display_name
  end
end
