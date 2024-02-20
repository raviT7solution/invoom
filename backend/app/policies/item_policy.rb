# frozen_string_literal: true

class ItemPolicy < ApplicationPolicy
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
      Item.where(restaurant: user!.restaurants)
    else
      Item.none
    end
  end

  def show?
    user!.admin?
  end

  def update?
    user!.admin?
  end
end
