# frozen_string_literal: true

class Mutations::ReceiptConfigurationUpdate < Mutations::BaseMutation
  argument :attributes, Types::ReceiptConfigurationAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(attributes:, id:)
    record = ReceiptConfigurationPolicy.new(context[:current_session]).scope.find(id)

    raise_error record.errors.full_messages.to_sentence unless record.update(attributes.to_h)

    true
  end
end
