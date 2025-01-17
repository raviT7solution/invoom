# frozen_string_literal: true

class Types::UserSessionType < Types::BaseObject
  field :auto_clock_in, Boolean, null: false
  field :clock_in_status, enum("UserSessionClockInStatus", ["already_clocked_in", "already_clocked_out"]), null: false
  field :permissions, [enum("UserSessionPermissionsType", Role::PERMISSIONS)], null: false
  field :token, String, null: false
end
