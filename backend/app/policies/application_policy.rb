# frozen_string_literal: true

class ApplicationPolicy
  attr_reader :session

  delegate \
    :cfd_admin!,
    :cfd_admin?,
    :kds_admin!,
    :kds_admin?,
    :mobile_admin!,
    :mobile_admin?,
    :mobile_user!,
    :web_admin!,
    :web_admin?,
    to: :session

  def initialize(session)
    @session = session
  end

  def mobile_user?(permission)
    session.mobile_user? && mobile_user!.permission?(permission)
  end
end
