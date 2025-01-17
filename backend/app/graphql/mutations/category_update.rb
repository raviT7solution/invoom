# frozen_string_literal: true

class Mutations::CategoryUpdate < Mutations::BaseMutation
  argument :attributes, Types::CategoryAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    category = CategoryPolicy.new(context[:current_session]).scope.find(id)

    raise_error category.errors.full_messages.to_sentence unless category.update(attributes.to_h)

    true
  end
end
