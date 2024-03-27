# frozen_string_literal: true

class ItemPolicy < ApplicationPolicy
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
      Item.where(restaurant: web_admin!.restaurants)
    else
      Item.none
    end
  end

  def show?
    web_admin?
  end

  def update?
    web_admin?
  end
end
