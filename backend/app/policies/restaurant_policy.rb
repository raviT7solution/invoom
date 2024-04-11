# frozen_string_literal: true

class RestaurantPolicy < ApplicationPolicy
  def scope
    if web_admin?
      web_admin!.restaurants
    elsif mobile_admin?
      mobile_admin!.restaurants
    elsif mobile_user?("orders")
      Restaurant.where(id: mobile_user!.restaurant_id)
    else
      Restaurant.none
    end
  end
end
