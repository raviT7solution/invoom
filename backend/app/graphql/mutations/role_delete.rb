# frozen_string_literal: true

class Mutations::RoleDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    role = RolePolicy.new(context[:current_session]).scope.find(id)

    raise_error role.errors.full_messages.to_sentence unless role.destroy

    true
  end
end
