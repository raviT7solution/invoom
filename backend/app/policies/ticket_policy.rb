# frozen_string_literal: true

class TicketPolicy < ApplicationPolicy
  def create?
    mobile_user?("orders")
  end

  def index?
    mobile_user?("orders")
  end

  def scope
    if mobile_user?("orders")
      Ticket.joins(booking: :restaurant).where(restaurants: { id: mobile_user!.restaurant_id })
    else
      Ticket.none
    end
  end
end
