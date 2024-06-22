# frozen_string_literal: true

class BookingPolicy < ApplicationPolicy
  def create?
    mobile_user?("orders")
  end

  def scope
    if mobile_user?("orders")
      Booking.where(restaurant: mobile_user!.restaurant)
    elsif kds_admin?
      Booking.where(restaurant: kds_admin!.restaurants)
    else
      Booking.none
    end
  end

  def update?
    mobile_user?("orders")
  end
end
