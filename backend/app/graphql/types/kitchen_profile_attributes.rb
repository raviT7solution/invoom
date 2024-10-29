# frozen_string_literal: true

class Types::KitchenProfileAttributes < Types::BaseInputObject
  argument :columns, Integer, required: false
  argument :name, String, required: false
  argument :notify, Boolean, required: false
  argument :printer_configuration_id, ID, required: false
  argument :rows, Integer, required: false

  argument :category_ids, [ID], required: false
end
