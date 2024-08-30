# frozen_string_literal: true

class UserSessionPolicy < ApplicationPolicy
  def create?
    mobile_admin?
  end

  def create_time_sheet?
    mobile_user?("clock_in_clock_out")
  end

  def destroy?
    mobile_user?("clock_in_clock_out")
  end
end
