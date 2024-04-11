# frozen_string_literal: true

class Types::BookingTableType < Types::BaseObject
  field :name, String, null: false

  field :booking, Types::BookingType, null: false, authorize: "BookingPolicy#show?"
  field :floor_object, Types::FloorObjectType, null: true, authorize: "FloorObjectPolicy#show?"
end
