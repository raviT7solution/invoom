# frozen_string_literal: true

class Mutations::MenuUpdate < Mutations::BaseMutation
  argument :attributes, Types::MenuAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    menu = MenuPolicy.new(context[:current_user]).scope.find(id)

    raise_error menu.errors.full_messages.to_sentence unless menu.update(attributes.to_h)

    true
  end
end
