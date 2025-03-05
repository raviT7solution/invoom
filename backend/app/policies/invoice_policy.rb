# frozen_string_literal: true

class InvoicePolicy < ApplicationPolicy
  def create?
    mobile_user?("orders") || mobile_user?("takeout")
  end

  def scope # rubocop:disable Metrics/AbcSize
    if web_admin?
      Invoice.joins(:booking).where(bookings: { restaurant_id: web_admin!.restaurants })
    elsif mobile_user?("orders") || mobile_user?("takeout")
      Invoice.joins(:booking).where(bookings: { restaurant_id: mobile_user!.restaurant_id })
    elsif cfd_admin?
      Invoice.joins(:booking).where(bookings: { restaurant_id: cfd_admin!.restaurants })
    else
      Invoice.none
    end
  end
end
