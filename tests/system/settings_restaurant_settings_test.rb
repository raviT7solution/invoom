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

  test "payments" do
    restaurant = create(:restaurant)
    admin = create(:admin, restaurant_ids: [restaurant.id])

    sign_in(admin)
    visit path_for(:frontend, "/settings/restaurant-settings")

    find("span", text: "Payment Gateway Configurations").click
    wait_for_pending_requests

    assert_text "Stripe account is not configured"

    click_on "Configure"
    wait_for_pending_requests

    within ".ant-drawer" do
      within ".ant-form-item", text: "Account type" do
        find(".ant-radio-wrapper", text: "Connect account").click
      end

      fill_in "Connect account ID", with: "connect_id"

      click_on "Submit"
      wait_for_pending_requests
    end

    assert_attributes restaurant.reload,
                      payment_publishable_key: nil,
                      payment_secret_key: nil,
                      stripe_account_id: "connect_id",
                      stripe_account_type: "connect"

    assert_text "Uses stripe connect account ID: connect_id"

    click_on "Reconfigure"
    wait_for_pending_requests

    within ".ant-drawer" do
      within ".ant-form-item", text: "Account type" do
        find(".ant-radio-wrapper", text: "Own account").click
      end

      fill_in "Publishable key", with: "publishable_key"
      fill_in "Secret key", with: "secret_key"

      click_on "Submit"
      wait_for_pending_requests
    end

    assert_attributes restaurant.reload,
                      payment_publishable_key: "publishable_key",
                      payment_secret_key: "secret_key",
                      stripe_account_id: nil,
                      stripe_account_type: "own"

    assert_text "Uses stripe own account"
  end
end
