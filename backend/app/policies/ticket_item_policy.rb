# frozen_string_literal: true

class TicketItemPolicy < ApplicationPolicy
  def scope # rubocop:disable Metrics/AbcSize
    if web_admin?
      TicketItem.joins(ticket: :booking).where(bookings: { restaurant_id: web_admin!.restaurants })
    elsif mobile_user?("orders") || mobile_user?("takeout")
      TicketItem.joins(ticket: :booking).where(bookings: { restaurant_id: mobile_user!.restaurant_id })
    elsif kds_admin?
      TicketItem.joins(ticket: :booking).where(bookings: { restaurant_id: kds_admin!.restaurants })
    elsif cfd_admin?
      TicketItem.joins(ticket: :booking).where(bookings: { restaurant_id: cfd_admin!.restaurants })
    else
      TicketItem.none
    end
  end

  def update?
    mobile_user?("orders") || mobile_user?("takeout") || kds_admin?
  end
end
