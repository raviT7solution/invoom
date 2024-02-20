# frozen_string_literal: true

class Types::ModifierType < Types::BaseObject
  field :global_modifier, Boolean, null: false
  field :id, ID, null: false
  field :multi_select, Boolean, null: false
  field :name, String, null: false
  field :values, [String], null: false
  field :visible, Boolean, null: false

  field :category_ids, [ID], null: false
  field :item_ids, [ID], null: false
end
