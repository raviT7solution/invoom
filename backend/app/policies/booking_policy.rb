# frozen_string_literal: true

class BookingPolicy < ApplicationPolicy
  def close?
    mobile_user?("orders") || mobile_user?("takeout")
  end

  def create?
    mobile_user?("orders") || mobile_user?("takeout")
  end

  def force_clock_out?
    mobile_user?("force_clock_out")
  end

  def scope
    if web_admin?
      Booking.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("orders") || mobile_user?("takeout")
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
