# frozen_string_literal: true

class PrinterConfigurationPolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def scope
    if web_admin?
      PrinterConfiguration.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("orders") || mobile_user?("takeout")
      PrinterConfiguration.where(restaurant_id: mobile_user!.restaurant_id)
    else
      PrinterConfiguration.none
    end
  end

  def update?
    web_admin?
  end
end
