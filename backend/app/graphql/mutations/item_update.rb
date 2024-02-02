# frozen_string_literal: true

class Mutations::ItemUpdate < Mutations::BaseMutation
  argument :attributes, Types::ItemAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    item = ItemPolicy.new(context[:current_user]).scope.find(id)

    raise_error item.errors.full_messages.to_sentence unless item.update(attributes.to_h)

    true
  end
end
