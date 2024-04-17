# frozen_string_literal: true

class Types::CategoryType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: false
  field :visible, Boolean, null: false

  field :menu_ids, [ID], null: false

  field :items, [Types::ItemType], null: false, authorize: "ItemPolicy#index?"
end
