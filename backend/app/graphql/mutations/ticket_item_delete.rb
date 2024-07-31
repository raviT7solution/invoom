# frozen_string_literal: true

class Mutations::TicketItemDelete < Mutations::BaseMutation
  argument :id, ID, required: true
  argument :operation_pin, String, required: false

  type Boolean, null: false

  def resolve(id:, operation_pin: nil)
    ticket_item = TicketItemPolicy.new(context[:current_user]).scope.find(id)

    if ticket_item.queued?
      destroy_queued_item(ticket_item, operation_pin)
    else
      cancel_not_queued_item(ticket_item, operation_pin)
    end

    true
  end

  private

  def cancel_not_queued_item(item, pin) # rubocop:disable Metrics/AbcSize
    if item.ticket.booking.restaurant.authenticate_pin(pin)
      invoice_items = InvoiceItem.where(ticket_item_id: item.id)
      if invoice_items.joins(:invoice).exists?(invoices: { status: :paid })
        raise_error "Invoice has been paid so item can't be delete"
      end
      if invoice_items.present?
        unless invoice_items.joins(:invoice).exists?(invoices: { status: :paid })
          invoice_items.destroy_all
          item.update!(status: :cancelled)
        end
      else
        item.update!(status: :cancelled)
      end

    else
      raise_error "Invalid pin"
    end
  end

  def destroy_queued_item(item, pin) # rubocop:disable Metrics/AbcSize
    authorize_to_delete = TicketItemPolicy.new(context[:current_user]).delete?

    if authorize_to_delete || item.ticket.booking.restaurant.authenticate_pin(pin)
      invoice_items = InvoiceItem.where(ticket_item_id: item.id)
      if invoice_items.present? && invoice_items.joins(:invoice).exists?(invoices: { status: :paid })
        raise_error "Invoice has been paid so item can't be delete"
      end

      invoice_items.destroy_all if invoice_items.present?
      raise_error item.errors.full_messages.to_sentence unless item.destroy
    else
      raise_error "Invalid pin"
    end
  end
end
