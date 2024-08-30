# frozen_string_literal: true

class Mutations::TicketCreate < Mutations::BaseMutation
  argument :attributes, [Types::TicketItemAttributes], required: true
  argument :booking_id, ID, required: true

  type Boolean, null: false

  def resolve(attributes:, booking_id:) # rubocop:disable Metrics/AbcSize
    booking = BookingPolicy.new(context[:current_user]).scope.find(booking_id)

    ticket = Ticket.new(booking: booking)

    attributes.each do |item_attributes|
      item = ItemPolicy.new(context[:current_user]).scope.find(item_attributes[:item_id])
      tax = item.tax

      ticket_item = ticket.ticket_items.new(
        cst: tax.cst,
        display_name: item.display_name,
        gst: tax.gst,
        hst: tax.hst,
        item: item,
        modifiers: item_attributes[:modifiers],
        name: item.name,
        note: item_attributes[:note],
        price: item_price_by_type(item, booking.booking_type),
        pst: tax.pst,
        qst: tax.qst,
        quantity: item_attributes[:quantity],
        rst: tax.rst,
        uom: item.uom
      )

      item.addons.find(item_attributes[:addon_ids]).each do |addon|
        ticket_item.ticket_item_addons.new(name: addon.name, price: addon_price_by_type(addon, booking.booking_type))
      end
    end

    raise_error ticket.errors.full_messages.to_sentence unless ticket.save

    true
  end

  private

  def addon_price_by_type(addon, booking_type)
    if booking_type == "takeout"
      addon.takeout_price
    elsif booking_type == "delivery"
      addon.delivery_price
    else
      addon.price
    end
  end

  def item_price_by_type(item, booking_type)
    if booking_type == "takeout"
      item.takeout_price
    elsif booking_type == "delivery"
      item.delivery_price
    else
      item.price
    end
  end
end
