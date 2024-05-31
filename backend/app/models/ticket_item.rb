# frozen_string_literal: true

class TicketItem < ApplicationRecord
  belongs_to :item
  belongs_to :ticket

  has_many :ticket_item_addons, dependent: :restrict_with_error

  enum :status, [:queued, :preparing, :ready, :served], default: :queued

  validates :display_name, presence: true
  validates :name, presence: true
  validates :price, presence: true
  validates :quantity, presence: true
  validates :status, presence: true
end
