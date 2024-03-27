# frozen_string_literal: true

class AdminPolicy < ApplicationPolicy
  def show?
    web_admin?
  end
end
