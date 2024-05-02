# frozen_string_literal: true

class Types::FloorObject::DataAddonsType < Types::BaseObject
  graphql_name "FloorObjectDataAddons"

  field :chairQuantity, GraphQL::Types::JSON, null: false # [Integer] | Integer # rubocop:disable GraphQL/FieldName
  field :type, enum("FloorObjectDataAddonsType", ["oval", "rectangular"]), null: false
end
