# frozen_string_literal: true

class FloorObjectPolicy < ApplicationPolicy
  def index?
    web_admin? || mobile_user?("floor_plan")
  end

  def scope
    if web_admin?
      FloorObject.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("floor_plan")
      FloorObject.where(restaurant: mobile_user!.restaurant_id)
    else
      FloorObject.none
    end
  end

  def update?
    web_admin?
  end
end
