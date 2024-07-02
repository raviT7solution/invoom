# frozen_string_literal: true

class TicketItemAddonPolicy < ApplicationPolicy
  def scope
    if mobile_user?("orders") || mobile_user?("takeout")
      TicketItemAddon.joins(ticket_item: { ticket: :booking })
                     .where(bookings: { restaurant_id: mobile_user!.restaurant_id })
    elsif kds_admin?
      TicketItemAddon.joins(ticket_item: { ticket: :booking }).where(bookings: { restaurant: kds_admin!.restaurants })
    else
      TicketItemAddon.none
    end
  end
end
