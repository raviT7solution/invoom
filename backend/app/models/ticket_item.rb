# frozen_string_literal: true

class TicketItem < ApplicationRecord
  belongs_to :item
  belongs_to :ticket

  has_many :invoice_items, dependent: :restrict_with_error
  has_many :ticket_item_addons, dependent: :destroy

  has_one :applied_discount, as: :discountable, dependent: :destroy

  enum :status, [:queued, :preparing, :ready, :served], default: :queued

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
  after_create_commit :invoice_item_create
  after_update_commit :broadcast_status, if: :saved_change_to_status?

  private

  def broadcast
    item.category.kitchen_profiles.each { |i| KitchenProfilesChannel.broadcast_to i, {} }
  end

  def broadcast_status
    TicketItemsChannel.broadcast_to(ticket.booking, {})
  end

  def invoice_item_create
    invoices = Invoice.where(booking_id: ticket.booking_id)

    return if invoices.blank?

    consume_bill = invoices.count

    addon_price = ticket_item_addons.sum(:price)
    unit_price = price + addon_price

    amount = unit_price * (quantity / consume_bill)

    invoices.each do |invoice|
      invoice.invoice_items.create!(
        consume_bill: consume_bill,
        price: amount,
        ticket_item: self
      )
    end
  end
end
