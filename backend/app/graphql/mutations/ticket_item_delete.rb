# frozen_string_literal: true

class Mutations::TicketItemDelete < Mutations::BaseMutation
  argument :id, ID, required: true
  argument :operation_pin, String, required: false

  type Boolean, null: false

  def resolve(id:, operation_pin: nil) # rubocop:disable Metrics/AbcSize
    ticket_item = TicketItemPolicy.new(context[:current_user]).scope.find(id)

    authorize_to_delete = TicketItemPolicy.new(context[:current_user]).delete?

    if authorize_to_delete || ticket_item.ticket.booking.restaurant.authenticate_pin(operation_pin)
      raise_error ticket_item.errors.full_messages.to_sentence unless ticket_item.destroy
    else
      raise_error "Invalid pin"
    end

    true
  end
end
