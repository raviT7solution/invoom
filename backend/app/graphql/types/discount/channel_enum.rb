# frozen_string_literal: true

class Types::Discount::ChannelEnum < Types::BaseEnum
  graphql_name "DiscountChannelEnum"

  Discount::CHANNELS.each { |i| value(i, value: i) }
end
