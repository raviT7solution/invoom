# frozen_string_literal: true

class Types::TicketType < Types::BaseObject
  field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  field :id, ID, null: false

  field :booking, Types::BookingType, scope: "BookingPolicy", preload: :booking, null: false
  field :ticket_items, [Types::TicketItemType], scope: "TicketItemPolicy", preload: :ticket_items, null: false
end
