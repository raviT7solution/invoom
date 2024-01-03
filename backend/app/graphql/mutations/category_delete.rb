# frozen_string_literal: true

class Mutations::CategoryDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    category = CategoryPolicy.new(context[:current_user]).scope.find(id)

    raise_error category.errors.full_messages.to_sentence unless category.destroy

    true
  end
end
