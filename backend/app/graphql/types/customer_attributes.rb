# frozen_string_literal: true

class Types::CustomerAttributes < Types::BaseInputObject
  argument :country_code, String, required: false
  argument :email, String, required: false
  argument :name, String, required: false
  argument :phone_number, String, required: false
end
