# frozen_string_literal: true

class TicketItemPolicy < ApplicationPolicy
  def index?
    mobile_user?("orders")
  end

  def scope
    if mobile_user?("orders")
      TicketItem.joins(ticket: { booking: :restaurant }).where(restaurants: { id: mobile_user!.restaurant_id })
    else
      TicketItem.none
    end
  end

  def update?
    mobile_user?("orders")
  end
end
