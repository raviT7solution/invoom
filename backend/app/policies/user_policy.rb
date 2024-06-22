# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def scope
    if web_admin?
      User.where(restaurant: web_admin!.restaurants)
    elsif mobile_admin?
      User.where(restaurant: mobile_admin!.restaurants)
    else
      User.none
    end
  end

  def update?
    web_admin?
  end
end
