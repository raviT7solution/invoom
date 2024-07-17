# frozen_string_literal: true

class DiscountPolicy < ApplicationPolicy
  def create?
    web_admin?
  end

  def delete?
    web_admin?
  end

  def scope
    if web_admin?
      Discount.where(restaurant: web_admin!.restaurants)
    elsif mobile_user?("apply_discount")
      Discount.where(restaurant_id: mobile_user!.restaurant_id, visible: true)
              .where.not("black_out_dates && ARRAY[?]::date[]", Date.current)
              .where(
                "(auto_apply = true AND repeat && ARRAY[?]::varchar[]) OR auto_apply = false",
                Date.current.strftime("%a")
              )
    else
      Discount.none
    end
  end

  def update?
    web_admin?
  end
end
