# frozen_string_literal: true

class BookingTablePolicy < ApplicationPolicy
  def scope
    if kds_admin?
      BookingTable.joins(:booking).where(bookings: { restaurant_id: kds_admin!.restaurants })
    elsif mobile_user?("orders")
      BookingTable.joins(:booking).where(bookings: { restaurant_id: mobile_user!.restaurant_id })
    else
      BookingTable.none
    end
  end
end
