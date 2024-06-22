# frozen_string_literal: true

class CategoryPolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def scope
    if web_admin?
      Category.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("orders")
      Category.where(restaurant_id: mobile_user!.restaurant_id, visible: true)
    else
      Category.none
    end
  end

  def update?
    web_admin?
  end
end
