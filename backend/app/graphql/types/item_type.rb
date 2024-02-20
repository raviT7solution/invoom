# frozen_string_literal: true

class Types::ItemType < Types::BaseObject
  field :cost_of_production, Float, null: false
  field :delivery_price, Float, null: false
  field :description, String, null: false
  field :display_name, String, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :price, Float, null: false
  field :take_out_price, Float, null: false
  field :visible, Boolean, null: false

  field :addon_ids, [ID], null: false
  field :category_id, ID, null: false
  field :modifier_ids, [ID], null: false
end
