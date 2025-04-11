# frozen_string_literal: true

class ReceiptConfigurationPolicy < ApplicationPolicy
  def scope
    if web_admin?
      ReceiptConfiguration.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("payments")
      ReceiptConfiguration.where(restaurant_id: mobile_user!.restaurant_id)
    else
      ReceiptConfiguration.none
    end
  end

  def update?
    web_admin?
  end
end
