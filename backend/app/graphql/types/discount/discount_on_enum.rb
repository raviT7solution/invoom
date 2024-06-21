# frozen_string_literal: true

class Types::Discount::DiscountOnEnum < Types::BaseEnum
  Discount.discount_ons.each_key { |i| value(i, value: i) }
end
