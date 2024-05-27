# frozen_string_literal: true

class Session
  attr_reader :header

  def initialize(header)
    @header = header
  end

  def kds_admin!
    @kds_admin ||= begin
      raise GraphQL::ExecutionError, "Unauthorized" unless kds_admin?

      Admin.find(token["kds_admin_id"])
    end
  end

  def kds_admin?
    token.present? && token["kds_admin_id"].present?
  end

  def mobile_admin!
    @mobile_admin ||= begin
      raise GraphQL::ExecutionError, "Unauthorized" unless mobile_admin?

      Admin.find(token["mobile_admin_id"])
    end
  end

  def mobile_admin?
    token.present? && token["mobile_admin_id"].present?
  end

  def mobile_user!
    @mobile_user ||= begin
      raise GraphQL::ExecutionError, "Unauthorized" unless mobile_user?

      User.find(token["mobile_user_id"])
    end
  end

  def mobile_user?
    token.present? && token["mobile_user_id"].present?
  end

  def web_admin!
    @web_admin ||= begin
      raise GraphQL::ExecutionError, "Unauthorized" unless web_admin?

      Admin.find(token["web_admin_id"])
    end
  end

  def web_admin?
    token.present? && token["web_admin_id"].present?
  end

  def self.secret
    @secret ||= Rails.application.credentials.secret_key_base || SecureRandom.uuid
  end

  def self.token(record, key)
    JWT.encode({ key => record.id, exp: 1.day.after.to_i }, secret)
  end

  private

  def token
    @token ||= begin
      JWT.decode(header, self.class.secret)[0]
    rescue JWT::DecodeError
      # do nothing
    end
  end
end
