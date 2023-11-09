# frozen_string_literal: true

class Mutations::RoleUpdate < Mutations::BaseMutation
  argument :attributes, Types::RoleAttributes, required: true
  argument :id, ID, required: true

  type Types::RoleType, null: false

  def resolve(id:, attributes:)
    role = RolePolicy.new(context[:current_user]).scope.find(id)

    if role.update(attributes.to_h)
      role
    else
      raise_error role.errors.full_messages.to_sentence
    end
  end
end
