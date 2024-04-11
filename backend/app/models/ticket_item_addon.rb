# frozen_string_literal: true

class TicketItemAddon < ApplicationRecord
  belongs_to :ticket_item

  validates :name, presence: true
  validates :price, presence: true
end
