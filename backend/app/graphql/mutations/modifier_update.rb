# frozen_string_literal: true

class Mutations::ModifierUpdate < Mutations::BaseMutation
  argument :attributes, Types::ModifierAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    modifier = ModifierPolicy.new(context[:current_user]).scope.find(id)

    raise_error modifier.errors.full_messages.to_sentence unless modifier.update(attributes.to_h)

    true
  end
end
