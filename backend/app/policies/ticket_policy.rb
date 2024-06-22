# frozen_string_literal: true

class TicketPolicy < ApplicationPolicy
  def create?
    mobile_user?("orders")
  end

  def scope
    if mobile_user?("orders")
      Ticket.joins(booking: :restaurant).where(restaurants: { id: mobile_user!.restaurant_id })
    elsif kds_admin?
      Ticket.joins(booking: :restaurant).where(restaurants: { id: kds_admin!.restaurants })
    else
      Ticket.none
    end
  end
end
