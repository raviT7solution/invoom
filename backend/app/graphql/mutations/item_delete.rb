# frozen_string_literal: true

class Mutations::ItemDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    item = ItemPolicy.new(context[:current_session]).scope.find(id)

    raise_error item.errors.full_messages.to_sentence unless item.destroy

    true
  end
end
