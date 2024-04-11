# frozen_string_literal: true

class Types::TicketItemType < Types::BaseObject
  field :display_name, String, null: false
  field :id, ID, null: false
  field :modifiers, [String], null: false
  field :name, String, null: false
  field :note, String, null: true
  field :price, Float, null: false
  field :quantity, Integer, null: false
  field :status, enum("TicketItemStatusType", TicketItem.statuses.keys), null: false

  field :ticket_item_addons, [Types::TicketItemAddonType], null: false, authorize: "TicketItemAddonPolicy#index?"
end
