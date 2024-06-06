# frozen_string_literal: true

class Mutations::ProductDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    product = ProductPolicy.new(context[:current_user]).scope.find(id)

    raise_error product.errors.full_messages.to_sentence unless product.destroy

    true
  end
end
