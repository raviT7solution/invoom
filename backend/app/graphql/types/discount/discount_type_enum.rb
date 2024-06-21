# frozen_string_literal: true

class Types::Discount::DiscountTypeEnum < Types::BaseEnum
  Discount.discount_types.each_key { |i| value(i, value: i) }
end
