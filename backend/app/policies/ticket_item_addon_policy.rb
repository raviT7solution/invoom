# frozen_string_literal: true

class TicketItemAddonPolicy < ApplicationPolicy
  def index?
    mobile_user?("orders") || kds_admin?
  end
end
