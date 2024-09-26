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
  after_create_commit :invoice_item_create

  private

  def broadcast
    item.category.kitchen_profiles.each { |i| TicketItemsChannel.broadcast_to i, {} }
  end

  def invoice_item_create # rubocop:disable Metrics/AbcSize
    return if ticket.booking.invoices.blank?

    consume_bill = ticket.booking.invoices.count

    addon_price = ticket_item_addons.sum(:price)
    unit_price = price + addon_price

    amount = unit_price * (quantity / consume_bill)

    ticket.booking.invoices.each do |invoice|
      invoice.invoice_items.create!(
        consume_bill: consume_bill,
        price: amount,
        ticket_item: self
      )
    end

    ticket.booking.invoices.each(&:update_amount!)
  end
end
