# frozen_string_literal: true

class TimeSheetPolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def scope
    if web_admin?
      TimeSheet.joins(:user).where(user: { restaurant_id: web_admin!.restaurants.ids })
    elsif mobile_user?("clock_in_clock_out")
      TimeSheet.where(user_id: mobile_user!.id)
    else
      TimeSheet.none
    end
  end

  def update?
    web_admin?
  end
end
