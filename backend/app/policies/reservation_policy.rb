# frozen_string_literal: true

class ReservationPolicy < ApplicationPolicy
  def create?
    mobile_user?("reservations")
  end

  def index?
    mobile_user?("reservations")
  end

  def scope
    if mobile_user?("reservations")
      Reservation.where(restaurant: mobile_user!.restaurant)
    else
      Reservation.none
    end
  end

  def update?
    mobile_user?("reservations")
  end
end
