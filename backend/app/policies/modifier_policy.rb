# frozen_string_literal: true

class ModifierPolicy < ApplicationPolicy
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
      Modifier.where(restaurant: web_admin!.restaurants)
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
