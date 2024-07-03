# frozen_string_literal: true

class InvoiceItemPolicy < ApplicationPolicy
  def scope
    if mobile_user?("orders") || mobile_user?("takeout")
      InvoiceItem.joins(:invoice).where(invoices: { restaurant_id: mobile_user!.restaurant_id })
    else
      InvoiceItem.none
    end
  end
end
