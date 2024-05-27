# frozen_string_literal: true

class AdminPolicy < ApplicationPolicy
  def show?
    web_admin? || mobile_admin? || kds_admin?
  end
end
