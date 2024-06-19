# frozen_string_literal: true

class ModifierPolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def index?
    web_admin?
  end

  def scope
    if web_admin?
      Modifier.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("orders")
      Modifier.where(restaurant_id: mobile_user!.restaurant_id, visible: true)
    else
      Modifier.none
    end
  end

  def show?
    web_admin?
  end

  def update?
    web_admin?
  end
end
