# frozen_string_literal: true

class Types::ReservationType < Types::BaseObject
  field :adults, Integer, null: false
  field :id, ID, null: false
  field :kids, Integer, null: false
  field :reservation_at, GraphQL::Types::ISO8601DateTime, null: false
  field :special_request, String, null: true
  field :status, Types::Reservation::StatusEnum, null: false

  field :customer, Types::CustomerType, scope: "CustomerPolicy", preload: :customer, null: false
end
