# frozen_string_literal: true

class Mutations::RoleUpdate < Mutations::BaseMutation
  argument :attributes, Types::RoleAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    role = RolePolicy.new(context[:current_session]).scope.find(id)

    raise_error role.errors.full_messages.to_sentence unless role.update(attributes.to_h)

    true
  end
end
