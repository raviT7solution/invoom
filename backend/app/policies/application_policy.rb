# frozen_string_literal: true

class ApplicationPolicy
  attr_reader :user

  def initialize(user)
    @user = user
  end

  def scope
    raise NotImplementedError
  end

  private

  def user!
    raise GraphQL::ExecutionError, "Unauthorized" unless user

    user
  end
end
