# frozen_string_literal: true

class ItemPolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def index?
    web_admin? || mobile_user?("orders")
  end

  def scope
    if web_admin?
      Item.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("orders")
      Item.where(restaurant_id: mobile_user!.restaurant_id, visible: true)
    else
      Item.none
    end
  end

  def show?
    web_admin? || mobile_user?("orders")
  end

  def update?
    web_admin?
  end
end
