# frozen_string_literal: true

class TaxPolicy < ApplicationPolicy
  def scope
    if web_admin? || mobile_user?("orders") || mobile_user?("takeout")
      Tax.all
    else
      Tax.none
    end
  end
end
