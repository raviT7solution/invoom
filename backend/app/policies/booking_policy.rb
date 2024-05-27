# frozen_string_literal: true

class BookingPolicy < ApplicationPolicy
  def create?
    mobile_user?("orders")
  end

  def index?
    mobile_user?("orders")
  end

  def scope
    if mobile_user?("orders")
      Booking.where(restaurant: mobile_user!.restaurant)
    else
      Booking.none
    end
  end

  def show?
    mobile_user?("orders") || kds_admin?
  end

  def update?
    mobile_user?("orders")
  end
end
