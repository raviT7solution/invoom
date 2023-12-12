# frozen_string_literal: true

class FloorObjectPolicy < ApplicationPolicy
  def index?
    user!.admin?
  end

  def scope
    if user!.admin?
      FloorObject.where(restaurant: user!.restaurants)
    else
      FloorObject.none
    end
  end

  def update?
    user!.admin?
  end
end
