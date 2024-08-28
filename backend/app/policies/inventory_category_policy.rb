# frozen_string_literal: true

class InventoryCategoryPolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def scope
    if web_admin?
      InventoryCategory.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("inventory")
      InventoryCategory.where(restaurant_id: mobile_user!.restaurant_id)
    else
      InventoryCategory.none
    end
  end

  def update?
    web_admin?
  end
end
