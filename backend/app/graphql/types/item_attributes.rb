# frozen_string_literal: true

class Types::ItemAttributes < Types::BaseInputObject
  argument :cost_of_production, Float, required: false
  argument :delivery_price, Float, required: false
  argument :description, String, required: false
  argument :display_name, String, required: false
  argument :eq_price, Boolean, required: false
  argument :name, String, required: false
  argument :price, Float, required: false
  argument :takeout_price, Float, required: false
  argument :uom, String, required: false
  argument :visible, Boolean, required: false

  argument :addon_ids, [ID], required: false
  argument :category_id, ID, required: false
  argument :modifier_ids, [ID], required: false
  argument :tax_id, ID, required: false
end
