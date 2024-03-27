# frozen_string_literal: true

class FloorObjectPolicy < ApplicationPolicy
  def index?
    web_admin?
  end

  def scope
    if web_admin?
      FloorObject.where(restaurant: web_admin!.restaurants)
    else
      FloorObject.none
    end
  end

  def update?
    web_admin?
  end
end
