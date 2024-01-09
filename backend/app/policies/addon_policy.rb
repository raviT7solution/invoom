# frozen_string_literal: true

class AddonPolicy < ApplicationPolicy
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
      Addon.where(restaurant: user!.restaurants)
    else
      Addon.none
    end
  end

  def show?
    user!.admin?
  end

  def update?
    user!.admin?
  end
end
