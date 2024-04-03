# frozen_string_literal: true

class UserSessionPolicy < ApplicationPolicy
  def create?
    mobile_admin?
  end
end
