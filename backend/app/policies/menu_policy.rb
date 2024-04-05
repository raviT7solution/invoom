# frozen_string_literal: true

class MenuPolicy < ApplicationPolicy
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
      Menu.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("orders")
      Menu.where(restaurant: mobile_user!.restaurant_id)
    else
      Menu.none
    end
  end

  def show?
    web_admin?
  end

  def update?
    web_admin?
  end
end
