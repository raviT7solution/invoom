# frozen_string_literal: true

class Types::Discount::RepeatEnum < Types::BaseEnum
  graphql_name "DiscountRepeatEnum"

  Discount::REPEAT.each { |i| value(i, value: i) }
end
