# frozen_string_literal: true

class ProductPolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def scope
    if web_admin?
      Product.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("inventory")
      Product.where(restaurants: mobile_user!.restaurant_id)
    else
      Product.none
    end
  end

  def update?
    web_admin?
  end
end
