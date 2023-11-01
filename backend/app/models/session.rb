# frozen_string_literal: true

class Session
  attr_reader :user

  def initialize(user)
    @user = user
  end

  def token # rubocop:disable Metrics/AbcSize
    return JWT.encode({ "admin_id" => user.id, exp: 1.day.after.to_i }, self.class.secret) if user.admin?

    JWT.encode({ "user_id" => user.id, exp: 1.day.after.to_i }, self.class.secret)
  end

  def self.find_by(token:)
    o = JWT.decode(token, secret)[0]

    return Admin.find(o["admin_id"]) if o["admin_id"].present?
    return User.find(o["user_id"]) if o["user_id"].present?

    nil
  rescue StandardError
    raise ActiveRecord::RecordNotFound.new("", name)
  end

  def self.secret
    @secret ||= Rails.application.credentials.secret_key_base || SecureRandom.uuid
  end
end
