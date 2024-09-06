# frozen_string_literal: true

class Types::AddonsAttributes < Types::BaseInputObject
  argument :delivery_price, Float, required: false
  argument :eq_price, Boolean, required: false
  argument :name, String, required: false
  argument :price, Float, required: false
  argument :takeout_price, Float, required: false
  argument :visible, Boolean, required: false
end
