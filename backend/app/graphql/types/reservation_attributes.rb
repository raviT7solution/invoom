# frozen_string_literal: true

class Types::ReservationAttributes < Types::BaseInputObject
  argument :pax, Integer, required: false
  argument :reservation_at, GraphQL::Types::ISO8601DateTime, required: false
  argument :status, enum("ReservationStatusAttribute", Reservation.statuses.keys), required: false

  argument :customer_id, ID, required: false
end
