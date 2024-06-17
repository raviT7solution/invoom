# frozen_string_literal: true

class Types::KitchenProfileType < Types::BaseObject
  field :columns, Integer, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :notify, Boolean, null: false
  field :rows, Integer, null: false

  field :category_ids, [ID], null: false
end
