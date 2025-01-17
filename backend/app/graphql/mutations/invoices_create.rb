# frozen_string_literal: true

class Mutations::InvoicesCreate < Mutations::BaseMutation
  argument :attributes, [Types::InvoiceAttributes], required: true
  argument :booking_id, ID, required: true

  type Boolean, null: false

  def resolve(attributes:, booking_id:)
    ApplicationRecord.transaction do
      create_invoices(attributes, booking_id)
    end

    true
  rescue ActiveRecord::ActiveRecordError => e
    raise_error e.record.errors.full_messages.to_sentence
  end

  private

  def create_invoices(attributes, booking_id) # rubocop:disable Metrics/AbcSize
    booking = BookingPolicy.new(context[:current_session]).scope.find(booking_id)
    invoices = booking.invoices

    revert_split!(invoices)

    attributes.each_with_index do |invoice_attributes, i|
      invoice = i.zero? ? invoices.first || booking.invoices.new : booking.invoices.new

      invoice_attributes[:invoice_items].each do |item_attributes|
        consume_bill = item_attributes[:consume_bill]
        ticket_item = TicketItemPolicy.new(context[:current_session]).scope.find(item_attributes[:ticket_item_id])

        addon_price = ticket_item.ticket_item_addons.sum(:price)
        unit_price = ticket_item.price + addon_price
        qty = ticket_item.quantity

        amount = unit_price * (qty / consume_bill)

        invoice.invoice_items.new(
          consume_bill: consume_bill,
          price: amount,
          ticket_item: ticket_item
        )
      end

      invoice.update!(invoice_type: invoice_attributes[:invoice_type], primary: i.zero?)
    end
  end

  def revert_split!(invoices)
    return if invoices.count.zero? # no revert split required

    primary_invoice = invoices.find_by!(primary: true)
    non_primary_invoices = invoices.where(primary: false)

    InvoiceItem.where(invoice_id: invoices).each(&:destroy!)

    Payment.where(invoice_id: invoices).update!(invoice_id: primary_invoice.id)

    non_primary_invoices.each(&:destroy!)
  end
end
