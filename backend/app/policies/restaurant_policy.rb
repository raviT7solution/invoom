# frozen_string_literal: true

class RestaurantPolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def index?
    web_admin? || mobile_admin? || kds_admin?
  end

  def scope # rubocop:disable Metrics/AbcSize
    if web_admin?
      web_admin!.restaurants
    elsif mobile_admin?
      mobile_admin!.restaurants.where(status: :active)
    elsif mobile_user?("orders") || mobile_user?("reservations") || mobile_user?("takeout")
      Restaurant.where(id: mobile_user!.restaurant_id)
    elsif kds_admin?
      kds_admin!.restaurants.where(status: :active)
    else
      Restaurant.none
    end
  end

  def update?
    web_admin?
  end
end
