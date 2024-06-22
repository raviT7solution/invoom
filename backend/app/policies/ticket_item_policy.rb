# frozen_string_literal: true

class TicketItemPolicy < ApplicationPolicy
  def delete?
    mobile_user?("delete_ticket_item")
  end

  def scope
    if mobile_user?("orders")
      TicketItem.joins(ticket: :booking).where(bookings: { restaurant_id: mobile_user!.restaurant_id })
    elsif kds_admin?
      TicketItem.joins(ticket: :booking).where(bookings: { restaurant_id: kds_admin!.restaurants })
    else
      TicketItem.none
    end
  end

  def update?
    mobile_user?("orders") || kds_admin?
  end
end
