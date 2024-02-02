# frozen_string_literal: true

class CategoryPolicy < ApplicationPolicy
  def authorized_fields
    if user.admin?
      [:items]
    else
      []
    end
  end

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
      Category.where(restaurant: user!.restaurants)
    else
      Category.none
    end
  end

  def show?
    user!.admin?
  end

  def update?
    user!.admin?
  end
end
