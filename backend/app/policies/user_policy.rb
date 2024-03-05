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
      User.where(restaurant: user!.restaurants)
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
