# frozen_string_literal: true

class Types::TicketItemAttributes < Types::BaseInputObject
  argument :display_name, String, required: false
  argument :note, String, required: false
  argument :price, Float, required: false
  argument :quantity, Float, required: false
  argument :status, enum("TicketItemStatusAttribute", TicketItem.statuses.keys), required: false

  argument :id, ID, required: false # Required for update
  argument :modifiers, [String], required: false

  argument :addon_ids, [ID], required: false
  argument :item_id, ID, required: false
end
