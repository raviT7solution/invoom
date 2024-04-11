# frozen_string_literal: true

class Types::BookingAttributes < Types::BaseInputObject
  argument :booking_type, enum("BookingTypeAttribute", Booking.booking_types.keys), required: false
  argument :clocked_in_at, GraphQL::Types::ISO8601DateTime, required: false

  argument :floor_object_ids, [ID], required: false
end
