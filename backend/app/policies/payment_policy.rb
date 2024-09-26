# frozen_string_literal: true

class PaymentPolicy < ApplicationPolicy
  def create?
    mobile_user?("payments")
  end

  def delete?
    mobile_user?("payments")
  end

  def scope
    if web_admin?
      Payment.joins(invoice: :booking).where(bookings: { restaurant_id: web_admin!.restaurants })
    elsif mobile_user?("payments")
      Payment.joins(invoice: :booking).where(bookings: { restaurant_id: mobile_user!.restaurant_id })
    else
      Payment.none
    end
  end

  def update?
    mobile_user?("payments")
  end
end
