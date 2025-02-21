# frozen_string_literal: true

class AppliedDiscountPolicy < ApplicationPolicy
  def create?
    mobile_user?("apply_discount")
  end

  def delete?
    mobile_user?("apply_discount")
  end

  def scope
    if web_admin?
      AppliedDiscount.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("orders") || mobile_user?("takeout")
      AppliedDiscount.where(restaurant_id: mobile_user!.restaurant_id)
    else
      AppliedDiscount.none
    end
  end
end
