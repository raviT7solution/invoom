# frozen_string_literal: true

class CustomerPolicy < ApplicationPolicy
  def create?
    mobile_user?("takeout")
  end

  def scope
    if kds_admin?
      Customer.where(restaurant: kds_admin!.restaurants)
    elsif mobile_user?("takeout") || mobile_user?("reservations")
      Customer.where(restaurant_id: mobile_user!.restaurant_id)
    else
      Customer.none
    end
  end
end
