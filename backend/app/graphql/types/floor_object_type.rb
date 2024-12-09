# frozen_string_literal: true

class Types::FloorObjectType < Types::BaseObject
  field :active_user_full_name, String, null: true
  field :data, Types::FloorObject::DataType, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :object_type, enum("FloorObjectType", FloorObject.object_types.keys), null: false

  field :booking_table, Types::BookingTableType, scope: "BookingTablePolicy", preload: :booking_table, null: true
end
