# frozen_string_literal: true

class Mutations::ModifierDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    modifier = ModifierPolicy.new(context[:current_user]).scope.find(id)

    raise_error modifier.errors.full_messages.to_sentence unless modifier.destroy

    true
  end
end
