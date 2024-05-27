# frozen_string_literal: true

class BookingTablePolicy < ApplicationPolicy
  def index?
    mobile_user?("orders") || kds_admin?
  end

  def show?
    mobile_user?("orders")
  end
end
