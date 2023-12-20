# frozen_string_literal: true

class Types::MenuAttributes < Types::BaseInputObject
  argument :description, String, required: false
  argument :name, String, required: false
  argument :visible, Boolean, required: false
end
