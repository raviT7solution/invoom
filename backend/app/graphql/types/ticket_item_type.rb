# frozen_string_literal: true

class Types::TicketItemType < Types::BaseObject
  field :display_name, String, null: false
  field :gst, Float, null: false
  field :hst, Float, null: false
  field :id, ID, null: false
  field :item_id, ID, null: false
  field :modifiers, [String], null: false
  field :name, String, null: false
  field :note, String, null: true
  field :price, Float, null: false
  field :pst, Float, null: false
  field :qst, Float, null: false
  field :quantity, Integer, null: false
  field :rst, Float, null: false
  field :status, enum("TicketItemStatusType", TicketItem.statuses.keys), null: false

  field :applied_discount, Types::AppliedDiscountType, scope: "AppliedDiscountPolicy", preload: :applied_discount, null: true # rubocop:disable Layout/LineLength
  field :ticket_item_addons, [Types::TicketItemAddonType], scope: "TicketItemAddonPolicy",
                                                           preload: :ticket_item_addons, null: false
end
