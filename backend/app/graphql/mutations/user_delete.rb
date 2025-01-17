# frozen_string_literal: true

class Mutations::UserDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    user = UserPolicy.new(context[:current_session]).scope.find(id)

    raise_error user.errors.full_messages.to_sentence unless user.destroy

    true
  end
end
