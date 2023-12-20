# frozen_string_literal: true

class MenuPolicy < ApplicationPolicy
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
      Menu.where(restaurant: user!.restaurants)
    else
      Menu.none
    end
  end

  def show?
    user!.admin?
  end

  def update?
    user!.admin?
  end
end
