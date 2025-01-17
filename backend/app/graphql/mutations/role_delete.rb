# frozen_string_literal: true

class Mutations::RoleDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Types::RoleType, null: false

  def resolve(id:)
    role = RolePolicy.new(context[:current_session]).scope.find(id)

    if role.destroy
      role
    else
      raise_error role.errors.full_messages.to_sentence
    end
  end
end
