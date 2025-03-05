# frozen_string_literal: true

class DevicePolicy < ApplicationPolicy
  def create?
    mobile_admin?
  end

  def delete?
    web_admin?
  end

  def scope
    if web_admin?
      Device.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("payments")
      Device.where(restaurant_id: mobile_user!.restaurant_id)
    elsif cfd_admin?
      Device.where(restaurant: cfd_admin!.restaurants)
    else
      Device.none
    end
  end

  def update?
    web_admin?
  end
end
