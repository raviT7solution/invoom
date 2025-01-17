# frozen_string_literal: true

module SessionsHelper
  def kds_sign_in(admin, restaurant, kitchen_profile)
    hash = { state: { token: kds_admin_token(admin) }, version: 0 }
    config = { state: { bookingTypes: [], kitchenProfileId: kitchen_profile.id, restaurantId: restaurant.id },
               version: 0 }

    visit path_for(:frontend, "/kds")
    page.execute_script "window.localStorage.setItem('kds-session-store', arguments[0]);", hash.to_json
    page.execute_script "window.localStorage.setItem('kitchen-config-store', arguments[0]);", config.to_json
  end

  def sign_in(admin)
    hash = { state: { token: web_admin_token(admin) }, version: 0 }

    visit path_for(:frontend, "/")
    page.execute_script "window.localStorage.setItem('session-store', arguments[0]);", hash.to_json
  end
end
