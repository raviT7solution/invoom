# frozen_string_literal: true

class RestaurantPolicy < ApplicationPolicy
  def scope
    if user!.admin?
      user!.restaurants
    else
      Restaurant.none
    end
  end
end
