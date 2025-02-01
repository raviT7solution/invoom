# frozen_string_literal: true

class Types::ReservationType < Types::BaseObject
  field :adults, Integer, null: false
  field :id, ID, null: false
  field :kids, Integer, null: false
  field :note, String, null: true
  field :reservation_at, GraphQL::Types::ISO8601DateTime, null: false
  field :status, Types::Reservation::StatusEnum, null: false
  field :table_name, String, null: true

  field :customer, Types::CustomerType, scope: "CustomerPolicy", preload: :customer, null: false
end
