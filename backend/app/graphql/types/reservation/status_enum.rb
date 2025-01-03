# frozen_string_literal: true

class Types::Reservation::StatusEnum < Types::BaseEnum
  graphql_name "ReservationStatusEnum"

  Reservation.statuses.each_key { |i| value(i, value: i) }
end
