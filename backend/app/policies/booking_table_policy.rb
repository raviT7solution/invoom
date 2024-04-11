# frozen_string_literal: true

class BookingTablePolicy < ApplicationPolicy
  def index?
    mobile_user?("orders")
  end

  def show?
    mobile_user?("orders")
  end
end
