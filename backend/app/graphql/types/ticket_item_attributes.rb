# frozen_string_literal: true

class Types::TicketItemAttributes < Types::BaseInputObject
  argument :note, String, required: false
  argument :quantity, Integer, required: false
  argument :status, enum("TicketItemStatusAttribute", TicketItem.statuses.keys), required: false

  argument :id, ID, required: false # Required for update
  argument :modifiers, [String], required: false
  argument :tax_id, ID, required: false

  argument :addon_ids, [ID], required: false
  argument :item_id, ID, required: false
end
