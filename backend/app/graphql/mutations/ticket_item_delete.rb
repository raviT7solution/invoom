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

  def cancel_not_queued_item(item, pin)
    if item.ticket.booking.restaurant.authenticate_pin(pin)
      raise_error item.errors.full_messages.to_sentence unless item.update(status: :cancelled)
    else
      raise_error "Invalid pin"
    end
  end

  def destroy_queued_item(item, pin)
    authorize_to_delete = TicketItemPolicy.new(context[:current_user]).delete?

    if authorize_to_delete || item.ticket.booking.restaurant.authenticate_pin(pin)
      raise_error item.errors.full_messages.to_sentence unless item.destroy
    else
      raise_error "Invalid pin"
    end
  end
end
