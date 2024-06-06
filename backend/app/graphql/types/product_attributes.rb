# frozen_string_literal: true

class Types::ProductAttributes < Types::BaseInputObject
  argument :description, String, required: false
  argument :item_code, String, required: false
  argument :name, String, required: false
  argument :price, Float, required: false
  argument :reorder_point, Float, required: false
  argument :stock_limit, Float, required: false
  argument :uom, String, required: false
  argument :visible, Boolean, required: false
  argument :weight, Float, required: false

  argument :inventory_category_id, ID, required: false
  argument :tax_id, ID, required: false
end
