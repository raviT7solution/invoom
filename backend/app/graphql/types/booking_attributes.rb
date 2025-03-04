# frozen_string_literal: true

class Types::BookingAttributes < Types::BaseInputObject
  argument :booking_type, enum("BookingTypeAttribute", Booking.booking_types.keys), required: false
  argument :customer_id, ID, required: false
  argument :estimated_duration, String, required: false
  argument :pax, Integer, required: false
  argument :table_names, [String], required: false
end
