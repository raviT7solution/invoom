# frozen_string_literal: true

class Types::UserSessionType < Types::BaseObject
  field :clock_in_status, enum("UserSessionClockInStatus", ["already_clocked_in", "already_clocked_out"]), null: true
  field :token, String, null: false
end
