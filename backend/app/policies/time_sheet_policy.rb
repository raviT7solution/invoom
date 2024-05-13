# frozen_string_literal: true

class TimeSheetPolicy < ApplicationPolicy
  def index?
    web_admin? || mobile_user?("clock_in_clock_out")
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
end
