# frozen_string_literal: true

class Mutations::MenuDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    menu = MenuPolicy.new(context[:current_session]).scope.find(id)

    raise_error menu.errors.full_messages.to_sentence unless menu.destroy

    true
  end
end
