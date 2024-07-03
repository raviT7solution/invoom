# frozen_string_literal: true

class InvoicePolicy < ApplicationPolicy
  def create?
    mobile_user?("orders") || mobile_user?("takeout")
  end

  def scope
    if mobile_user?("orders") || mobile_user?("takeout")
      Invoice.joins(:booking).where(bookings: { restaurant_id: mobile_user!.restaurant_id })
    else
      Invoice.none
    end
  end
end
