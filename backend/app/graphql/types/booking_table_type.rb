# frozen_string_literal: true

class Types::BookingTableType < Types::BaseObject
  field :name, String, null: false

  field :booking, Types::BookingType, scope: "BookingPolicy", preload: :booking, null: false
  field :floor_object, Types::FloorObjectType, scope: "FloorObjectPolicy", preload: :floor_object, null: true
end
