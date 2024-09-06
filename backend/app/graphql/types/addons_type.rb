# frozen_string_literal: true

class Types::AddonsType < Types::BaseObject
  field :delivery_price, Float, null: false
  field :eq_price, Boolean, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :price, Float, null: false
  field :takeout_price, Float, null: false
  field :visible, Boolean, null: false
end
