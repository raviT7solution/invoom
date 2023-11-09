# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def create?
    user!.admin?
  end

  def delete?
    user!.admin?
  end

  def scope
    if user!.admin?
      User.joins(:restaurants).where(restaurants: { id: user!.restaurants.ids })
    else
      User.none
    end
  end

  def show?
    user!
  end

  def update?
    user!.admin?
  end
end
