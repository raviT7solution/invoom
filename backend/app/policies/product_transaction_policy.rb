# frozen_string_literal: true

class ProductTransactionPolicy < ApplicationPolicy
  def create?
    web_admin? || mobile_user?("inventory")
  end
end
