# frozen_string_literal: true

class TicketItem < ApplicationRecord
  belongs_to :item
  belongs_to :ticket

  has_many :invoice_items, dependent: :restrict_with_error
  has_many :ticket_item_addons, dependent: :destroy

  has_one :applied_discount, as: :discountable, dependent: :destroy

  enum :status, [:queued, :preparing, :ready, :served, :cancelled], default: :queued

  validates :cst, presence: true
  validates :display_name, presence: true
  validates :gst, presence: true
  validates :hst, presence: true
  validates :name, presence: true
  validates :price, presence: true
  validates :pst, presence: true
  validates :qst, presence: true
  validates :quantity, presence: true
  validates :rst, presence: true
  validates :status, presence: true
  validates :uom, presence: true

  after_commit :broadcast

  private

  def broadcast
    item.category.kitchen_profiles.each { |i| TicketItemsChannel.broadcast_to i, {} }
  end
end
