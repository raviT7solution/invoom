# frozen_string_literal: true

class Types::FloorObjectAttributes < Types::BaseInputObject
  argument :data, GraphQL::Types::JSON, required: false
  argument :name, String, required: false
  argument :object_type, String, required: false
end
