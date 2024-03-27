# frozen_string_literal: true

class RolePolicy < ApplicationPolicy
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
      Role.where(restaurant: web_admin!.restaurants)
    else
      Role.none
    end
  end

  def show?
    web_admin?
  end

  def update?
    web_admin?
  end
end
