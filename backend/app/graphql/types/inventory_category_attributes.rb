# frozen_string_literal: true

class Types::InventoryCategoryAttributes < Types::BaseInputObject
  argument :description, String, required: false
  argument :name, String, required: false
  argument :visible, Boolean, required: false
end
