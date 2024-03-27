# frozen_string_literal: true

class CategoryPolicy < ApplicationPolicy
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
      Category.where(restaurant: web_admin!.restaurants)
    else
      Category.none
    end
  end

  def show?
    web_admin?
  end

  def update?
    web_admin?
  end
end
