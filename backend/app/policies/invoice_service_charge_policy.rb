# frozen_string_literal: true

class InvoiceServiceChargePolicy < ApplicationPolicy
  def scope
    if mobile_user?("orders") || mobile_user?("takeout")
      InvoiceServiceCharge.joins(invoice: :booking).where(bookings: { restaurant_id: mobile_user!.restaurant_id })
    else
      InvoiceServiceCharge.none
    end
  end

  def update?
    mobile_user?("orders") || mobile_user?("takeout")
  end
end
