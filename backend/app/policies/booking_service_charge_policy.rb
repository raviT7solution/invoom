# frozen_string_literal: true

class BookingServiceChargePolicy < ApplicationPolicy
  def scope
    if mobile_user?("orders") || mobile_user?("takeout")
      BookingServiceCharge.joins(:booking).where(bookings: { restaurant_id: mobile_user!.restaurant_id })
    else
      BookingServiceCharge.none
    end
  end

  def update?
    mobile_user?("orders") || mobile_user?("takeout")
  end
end
