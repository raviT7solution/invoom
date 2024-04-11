# frozen_string_literal: true

class Types::TicketType < Types::BaseObject
  field :id, ID, null: false

  field :booking, Types::BookingType, null: false, authorize: "BookingPolicy#show?"
  field :ticket_items, [Types::TicketItemType], null: false, authorize: "TicketItemPolicy#index?"
end
