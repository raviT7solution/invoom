# frozen_string_literal: true

class Types::PrinterConfigurationAttributes < Types::BaseInputObject
  argument :ip_address, String, required: false
  argument :name, String, required: false
  argument :port, String, required: false
  argument :visible, Boolean, required: false
end
