# frozen_string_literal: true

class ApplicationPolicy
  attr_reader :session

  delegate \
    :mobile_admin!,
    :mobile_admin?,
    :mobile_user!,
    :mobile_user?,
    :web_admin!,
    :web_admin?,
    to: :session

  def initialize(session)
    @session = session
  end
end
