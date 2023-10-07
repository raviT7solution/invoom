# frozen_string_literal: true

class User::Session
  attr_reader :user

  def initialize(user)
    @user = user
  end

  def token
    JWT.encode({ "user_id" => user.id, exp: 1.day.after.to_i }, self.class.secret)
  end

  def self.find_by!(token:)
    id = JWT.decode(token, secret)[0]["user_id"]
    User.find(id)
  rescue StandardError
    raise ActiveRecord::RecordNotFound.new("", name)
  end

  def self.secret
    @secret ||= Rails.application.credentials.secret_key_base || SecureRandom.uuid
  end
end
