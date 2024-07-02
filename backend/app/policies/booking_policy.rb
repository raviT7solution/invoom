# frozen_string_literal: true

class BookingPolicy < ApplicationPolicy
  def close?
    mobile_user?("orders") || mobile_user?("takeout")
  end

  def create?
    mobile_user?("orders") || mobile_user?("takeout")
  end

  def scope
    if mobile_user?("orders") || mobile_user?("takeout")
      Booking.where(restaurant: mobile_user!.restaurant)
    elsif kds_admin?
      Booking.where(restaurant: kds_admin!.restaurants)
    else
      Booking.none
    end
  end

  def update?
    mobile_user?("orders") || mobile_user?("takeout")
  end
end
