# frozen_string_literal: true

class MenuPolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def scope
    if web_admin?
      Menu.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("orders")
      Menu.where(restaurant: mobile_user!.restaurant_id, visible: true)
    else
      Menu.none
    end
  end

  def update?
    web_admin?
  end
end
