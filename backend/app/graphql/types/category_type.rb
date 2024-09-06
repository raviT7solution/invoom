# frozen_string_literal: true

class Types::CategoryType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: false
  field :tax_id, ID, null: true
  field :visible, Boolean, null: false

  field :menu_ids, [ID], scope: "MenuPolicy", preload: :menus, null: false

  field :items, [Types::ItemType], scope: "ItemPolicy", preload: :items, null: false
end
