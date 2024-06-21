# frozen_string_literal: true

class Types::AppliedDiscountType < Types::BaseObject
  field :discount_type, Types::Discount::DiscountTypeEnum, null: false
  field :discountable_id, ID, null: false
  field :discountable_type, String, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :value, Float, null: false
end
