# frozen_string_literal: true

class Types::MenuType < Types::BaseObject
  field :description, String, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :visible, Boolean, null: false

  field :categories, [Types::CategoryType], authorize: "CategoryPolicy#index?", null: false
end
