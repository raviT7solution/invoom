# frozen_string_literal: true

class CustomerPolicy < ApplicationPolicy
  def create?
    mobile_user?("takeout")
  end

  def index?
    mobile_user?("takeout")
  end

  def scope
    if mobile_user?("takeout")
      Customer.where(restaurant: mobile_user!.restaurant)
    else
      Customer.none
    end
  end

  def show?
    kds_admin? || mobile_user?("takeout") || mobile_user?("reservations")
  end
end
