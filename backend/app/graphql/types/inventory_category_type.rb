# frozen_string_literal: true

class Types::InventoryCategoryType < Types::BaseObject
  field :description, String, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :visible, Boolean, null: false
end
