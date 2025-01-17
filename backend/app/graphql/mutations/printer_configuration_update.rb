# frozen_string_literal: true

class Mutations::PrinterConfigurationUpdate < Mutations::BaseMutation
  argument :attributes, Types::PrinterConfigurationAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    printer_config = PrinterConfigurationPolicy.new(context[:current_session]).scope.find(id)

    raise_error printer_config.errors.full_messages.to_sentence unless printer_config.update(attributes.to_h)

    true
  end
end
