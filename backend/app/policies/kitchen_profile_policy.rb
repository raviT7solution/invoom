# frozen_string_literal: true

class KitchenProfilePolicy < ApplicationPolicy
  def index?
    kds_admin?
  end

  def scope
    if kds_admin?
      KitchenProfile.where(restaurant: kds_admin!.restaurants)
    else
      KitchenProfile.none
    end
  end
end
