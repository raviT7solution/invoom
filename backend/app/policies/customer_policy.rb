# frozen_string_literal: true

class CustomerPolicy < ApplicationPolicy
  def create?
    mobile_user?("orders") || mobile_user?("takeout") || mobile_user?("reservations")
  end

  def scope
    if web_admin?
      Customer.where(restaurant: web_admin!.restaurants)
    elsif kds_admin?
      Customer.where(restaurant: kds_admin!.restaurants)
    elsif mobile_user?("orders") || mobile_user?("takeout") || mobile_user?("reservations")
      Customer.where(restaurant_id: mobile_user!.restaurant_id)
    else
      Customer.none
    end
  end

  def update?
    mobile_user?("orders") || mobile_user?("takeout") || mobile_user?("reservations")
  end
end
