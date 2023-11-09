# frozen_string_literal: true

class AdminPolicy < ApplicationPolicy
  def show?
    user!.admin?
  end
end
