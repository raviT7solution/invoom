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
    else
      Device.none
    end
  end

  def update?
    web_admin?
  end
end
