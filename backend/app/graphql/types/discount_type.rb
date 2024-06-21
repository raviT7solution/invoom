# frozen_string_literal: true

class Types::DiscountType < Types::BaseObject
  field :auto_apply, Boolean, null: false
  field :black_out_dates, [GraphQL::Types::ISO8601Date], null: false
  field :capping, Float, null: false
  field :channels, [Types::Discount::ChannelEnum], null: false
  field :clubbed, Boolean, null: false
  field :discount_on, Types::Discount::DiscountOnEnum, null: false
  field :discount_type, Types::Discount::DiscountTypeEnum, null: false
  field :end_date_time, GraphQL::Types::ISO8601DateTime, null: true
  field :id, ID, null: false
  field :name, String, null: false
  field :repeat, [Types::Discount::RepeatEnum], null: false
  field :start_date_time, GraphQL::Types::ISO8601DateTime, null: true
  field :threshold, Float, null: false
  field :value, Float, null: false
  field :visible, Boolean, null: false

  field :category_ids, [ID], null: false
  field :item_ids, [ID], null: false
end
