# frozen_string_literal: true

class Types::TicketItemAddonType < Types::BaseObject
  field :id, ID, null: false
  field :name, String, null: false
  field :price, Float, null: false
end
