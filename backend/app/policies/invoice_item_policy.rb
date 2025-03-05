# frozen_string_literal: true

class InvoiceItemPolicy < ApplicationPolicy
  def scope # rubocop:disable Metrics/AbcSize
    if web_admin?
      InvoiceItem.joins(invoice: :booking).where(bookings: { restaurant_id: web_admin!.restaurants })
    elsif mobile_user?("orders") || mobile_user?("takeout")
      InvoiceItem.joins(invoice: :booking).where(bookings: { restaurant_id: mobile_user!.restaurant_id })
    elsif cfd_admin?
      InvoiceItem.joins(invoice: :booking).where(bookings: { restaurant_id: cfd_admin!.restaurants })
    else
      InvoiceItem.none
    end
  end
end
