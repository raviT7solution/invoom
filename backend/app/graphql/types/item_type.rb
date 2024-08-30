# frozen_string_literal: true

class Types::ItemType < Types::BaseObject
  field :cost_of_production, Float, null: false
  field :delivery_price, Float, null: false
  field :description, String, null: false
  field :display_name, String, null: false
  field :eq_price, Boolean, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :price, Float, null: false
  field :takeout_price, Float, null: false
  field :uom, String, null: false
  field :visible, Boolean, null: false

  field :addon_ids, [ID], scope: "AddonPolicy", preload: :addons, null: false
  field :category_id, ID, null: false
  field :modifier_ids, [ID], scope: "ModifierPolicy", preload: :modifiers, null: false
  field :tax_id, ID, null: false

  field :addons, [Types::AddonsType], scope: "AddonPolicy", preload: :addons, null: false
  field :modifiers, [Types::ModifierType], scope: "ModifierPolicy", preload: :modifiers, null: false
  field :tax, Types::TaxType, scope: "TaxPolicy", preload: :tax, null: false
end
