# frozen_string_literal: true

class RestaurantPolicy < ApplicationPolicy
  def scope
    if web_admin?
      web_admin!.restaurants
    else
      Restaurant.none
    end
  end
end
