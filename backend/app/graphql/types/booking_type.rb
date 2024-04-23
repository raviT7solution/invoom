# frozen_string_literal: true

class Types::BookingType < Types::BaseObject
  field :booking_type, enum("BookingType", Booking.booking_types.keys), null: false
  field :clocked_in_at, GraphQL::Types::ISO8601DateTime, null: false
  field :clocked_out_at, GraphQL::Types::ISO8601DateTime, null: true
  field :id, ID, null: false
  field :pax, Integer, null: true

  field :booking_tables, [Types::BookingTableType], null: false, authorize: "BookingTablePolicy#index?"
  field :tickets, [Types::TicketType], null: false, authorize: "TicketPolicy#index?"
  field :user_full_name, String, null: false

  def user_full_name
    object.user.full_name
  end
end
