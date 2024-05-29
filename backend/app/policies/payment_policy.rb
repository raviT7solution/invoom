# frozen_string_literal: true

class PaymentPolicy < ApplicationPolicy
  def create?
    mobile_user?("payments")
  end
end
