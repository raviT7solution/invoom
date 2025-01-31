# frozen_string_literal: true

class FloorObjectPolicy < ApplicationPolicy
  def force_unlock?
    mobile_user?("force_unlock")
  end

  def scope
    if web_admin?
      FloorObject.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("orders") || mobile_user?("floor_plan")
      FloorObject.where(restaurant_id: mobile_user!.restaurant_id)
    else
      FloorObject.none
    end
  end

  def update?
    web_admin?
  end
end
