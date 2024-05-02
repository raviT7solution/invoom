# frozen_string_literal: true

class Types::FloorObject::DataType < Types::BaseObject
  graphql_name "FloorObjectData"

  field :addons, Types::FloorObject::DataAddonsType, null: true
  field :length, Float, null: false
  field :rotate, Float, null: false
  field :translateX, Float, null: false # rubocop:disable GraphQL/FieldName
  field :translateY, Float, null: false # rubocop:disable GraphQL/FieldName
  field :width, Float, null: false
end
