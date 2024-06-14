# frozen_string_literal: true

class TaxPolicy < ApplicationPolicy
  def index?
    web_admin?
  end

  def scope
    if web_admin?
      Tax.all
    else
      Tax.none
    end
  end

  def show?
    mobile_user?("orders") || mobile_user?("takeout")
  end
end
