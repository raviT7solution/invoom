# frozen_string_literal: true

class Types::RoleAttributes < Types::BaseInputObject
  argument :name, String, required: false
  argument :permissions, [String], required: false
end
