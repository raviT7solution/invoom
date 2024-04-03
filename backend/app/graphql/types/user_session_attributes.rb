# frozen_string_literal: true

class Types::UserSessionAttributes < Types::BaseInputObject
  argument :clock_type, enum("UserSessionClockType", ["clock_in", "clock_out"]), required: true
  argument :login_type, enum("UserSessionLoginType", ["pin", "password"]), required: true
  argument :password, String, required: false
  argument :pin, String, required: false
  argument :user_id, ID, required: false
end
