# frozen_string_literal: true

class KitchenProfilePolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def scope
    if kds_admin?
      KitchenProfile.where(restaurant: kds_admin!.restaurants)
    elsif web_admin?
      KitchenProfile.where(restaurant: web_admin!.restaurants)
    else
      KitchenProfile.none
    end
  end

  def update?
    web_admin?
  end
end
