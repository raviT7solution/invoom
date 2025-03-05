# frozen_string_literal: true

class Session < ApplicationRecord
  belongs_to :device, optional: true
  belongs_to :sessionable, polymorphic: true

  enum :subject, { cfd_admin: "cfd_admin", kds_admin: "kds_admin", mobile_admin: "mobile_admin", mobile_user: "mobile_user", web_admin: "web_admin" }, scopes: false # rubocop:disable Layout/LineLength

  validates :device_id, presence: true, if: :mobile_user?
  validates :subject, presence: true

  def self.cfd_admin_token(admin)
    create!(sessionable: admin, subject: "cfd_admin").signed_id
  end

  def self.kds_admin_token(admin)
    create!(sessionable: admin, subject: "kds_admin").signed_id
  end

  def self.mobile_admin_token(admin, device = nil)
    create!(device: device, sessionable: admin, subject: "mobile_admin").signed_id
  end

  def self.mobile_user_token(user, device)
    create!(device: device, sessionable: user, subject: "mobile_user").signed_id
  end

  def self.web_admin_token(admin)
    create!(sessionable: admin, subject: "web_admin").signed_id(expires_in: 1.day)
  end

  def cfd_admin!
    @cfd_admin ||= begin
      raise GraphQL::ExecutionError, "Unauthorized" unless cfd_admin?

      sessionable
    end
  end

  def kds_admin!
    @kds_admin ||= begin
      raise GraphQL::ExecutionError, "Unauthorized" unless kds_admin?

      sessionable
    end
  end

  def mobile_admin!
    @mobile_admin ||= begin
      raise GraphQL::ExecutionError, "Unauthorized" unless mobile_admin?

      sessionable
    end
  end

  def mobile_user!
    @mobile_user ||= begin
      raise GraphQL::ExecutionError, "Unauthorized" unless mobile_user?

      sessionable
    end
  end

  def web_admin!
    @web_admin ||= begin
      raise GraphQL::ExecutionError, "Unauthorized" unless web_admin?

      sessionable
    end
  end
end
