# frozen_string_literal: true

class ServiceChargePolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def scope
    if web_admin?
      ServiceCharge.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("orders") || mobile_user?("takeout")
      ServiceCharge.where(restaurant_id: mobile_user!.restaurant_id, visible: true)
    else
      ServiceCharge.none
    end
  end

  def update?
    web_admin?
  end
end
