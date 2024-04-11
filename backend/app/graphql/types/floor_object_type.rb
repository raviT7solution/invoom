# frozen_string_literal: true

class Types::FloorObjectType < Types::BaseObject
  field :data, GraphQL::Types::JSON, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :object_type, String, null: false

  field :booking_table, Types::BookingTableType, null: true, authorize: "BookingTablePolicy#show?"
end
