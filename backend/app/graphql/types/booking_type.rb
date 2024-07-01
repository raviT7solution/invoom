# frozen_string_literal: true

class Types::BookingType < Types::BaseObject
  field :booking_type, enum("BookingType", Booking.booking_types.keys), null: false
  field :clocked_in_at, GraphQL::Types::ISO8601DateTime, null: false
  field :clocked_out_at, GraphQL::Types::ISO8601DateTime, null: true
  field :estimated_duration, String, null: true
  field :id, ID, null: false
  field :number, Integer, null: false
  field :pax, Integer, null: true
  field :token, String, null: true

  field :applied_discount, Types::AppliedDiscountType, scope: "AppliedDiscountPolicy", preload: :applied_discount, null: true # rubocop:disable Layout/LineLength
  field :booking_tables, [Types::BookingTableType], scope: "BookingTablePolicy", preload: :booking_tables, null: false
  field :customer, Types::CustomerType, scope: "CustomerPolicy", preload: :customer, null: true
  field :tickets, [Types::TicketType], scope: "TicketPolicy", preload: :tickets, null: false

  field :user_full_name, String, preload: :user, null: false

  def user_full_name
    object.user.full_name
  end
end
