# frozen_string_literal: true

class Types::DeviceAttributes < Types::BaseInputObject
  argument :fingerprint, String, required: false
  argument :name, String, required: false
end
