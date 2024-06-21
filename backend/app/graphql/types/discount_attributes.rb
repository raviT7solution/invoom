# frozen_string_literal: true

class Types::DiscountAttributes < Types::BaseInputObject
  argument :auto_apply, Boolean, required: false
  argument :black_out_dates, [GraphQL::Types::ISO8601Date], required: false
  argument :capping, Float, required: false
  argument :channels, [Types::Discount::ChannelEnum], required: false
  argument :clubbed, Boolean, required: false
  argument :discount_on, Types::Discount::DiscountOnEnum, required: false
  argument :discount_type, Types::Discount::DiscountTypeEnum, required: false
  argument :end_date_time, GraphQL::Types::ISO8601DateTime, required: false
  argument :name, String, required: false
  argument :repeat, [Types::Discount::RepeatEnum], required: false
  argument :start_date_time, GraphQL::Types::ISO8601DateTime, required: false
  argument :threshold, Float, required: false
  argument :value, Float, required: false
  argument :visible, Boolean, required: false

  argument :category_ids, [ID], required: false
  argument :item_ids, [ID], required: false
end
