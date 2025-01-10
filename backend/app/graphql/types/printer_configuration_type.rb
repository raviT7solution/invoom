# frozen_string_literal: true

class Types::PrinterConfigurationType < Types::BaseObject
  field :id, ID, null: false
  field :ip_address, String, null: false
  field :name, String, null: false
  field :port, String, null: false
  field :visible, Boolean, null: false

  field :ticket_items, [Types::TicketItemType], scope: "TicketItemPolicy", preload: :ticket_items, null: false
end
