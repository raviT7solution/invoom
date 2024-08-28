# frozen_string_literal: true

class Types::ProductType < Types::BaseObject
  field :available_quantity, Float, null: false
  field :description, String, null: true
  field :id, ID, null: false
  field :inventory_category_id, ID, null: false
  field :item_code, String, null: false
  field :name, String, null: false
  field :price, Float, null: false
  field :reorder_point, Float, null: false
  field :stock_limit, Float, null: false
  field :tax_id, ID, null: false
  field :uom, String, null: false
  field :visible, Boolean, null: false
  field :weight, Float, null: false

  field :inventory_category, Types::InventoryCategoryType, scope: "InventoryCategoryPolicy", preload: :inventory_category, null: false # rubocop:disable Layout/LineLength
  field :tax, Types::TaxType, scope: "TaxPolicy", preload: :tax, null: false
end
