# frozen_string_literal: true

class AddonPolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def scope
    if web_admin?
      Addon.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("orders") || mobile_user?("takeout")
      Addon.where(restaurant_id: mobile_user!.restaurant_id, visible: true)
    else
      Addon.none
    end
  end

  def update?
    web_admin?
  end
end
