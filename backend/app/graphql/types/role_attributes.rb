# frozen_string_literal: true

class Types::RoleAttributes < Types::BaseInputObject
  argument :auto_clock_in, Boolean, required: false
  argument :name, String, required: false
  argument :permissions, [String], required: false
end
