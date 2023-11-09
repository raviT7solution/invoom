# frozen_string_literal: true

class RolePolicy < ApplicationPolicy
  def create?
    user!.admin?
  end

  def delete?
    user!.admin?
  end

  def index?
    user!.admin?
  end

  def scope
    if user!.admin?
      Role.where(restaurant: user!.restaurants)
    else
      Role.none
    end
  end

  def show?
    user!.admin?
  end

  def update?
    user!.admin?
  end
end
