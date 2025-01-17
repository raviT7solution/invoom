# frozen_string_literal: true

class Mutations::PrinterConfigurationDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    printer_config = PrinterConfigurationPolicy.new(context[:current_session]).scope.find(id)

    raise_error printer_config.errors.full_messages.to_sentence unless printer_config.destroy

    true
  end
end
