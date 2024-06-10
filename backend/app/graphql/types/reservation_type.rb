# frozen_string_literal: true

class Types::ReservationType < Types::BaseObject
  field :id, ID, null: false
  field :pax, Integer, null: false
  field :reservation_at, GraphQL::Types::ISO8601DateTime, null: false
  field :status, enum("ReservationStatusType", Reservation.statuses.keys), null: false

  field :customer, Types::CustomerType, null: false, authorize: "CustomerPolicy#show?"
end
