# frozen_string_literal: true

class ItemPolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def scope
    if web_admin?
      Item.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("orders") || mobile_user?("takeout")
      Item.where(restaurant_id: mobile_user!.restaurant_id, visible: true)
    else
      Item.none
    end
  end

  def update?
    web_admin?
  end
end
