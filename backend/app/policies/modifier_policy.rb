# frozen_string_literal: true

class ModifierPolicy < ApplicationPolicy
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
      Modifier.where(restaurant: user!.restaurants)
    else
      Modifier.none
    end
  end

  def show?
    user!.admin?
  end

  def update?
    user!.admin?
  end
end
