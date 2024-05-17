# frozen_string_literal: true

class Types::CustomerAttributes < Types::BaseInputObject
  argument :name, String, required: false
  argument :phone_number, String, required: false
end
