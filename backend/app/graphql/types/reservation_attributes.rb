# frozen_string_literal: true

class Types::ReservationAttributes < Types::BaseInputObject
  argument :adults, Integer, required: false
  argument :kids, Integer, required: false
  argument :note, String, required: false
  argument :reservation_at, GraphQL::Types::ISO8601DateTime, required: false
  argument :status, Types::Reservation::StatusEnum, required: false
  argument :table_name, String, required: false

  argument :customer_id, ID, required: false
end
