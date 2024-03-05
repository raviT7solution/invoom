# frozen_string_literal: true

class Mutations::UserUpdate < Mutations::BaseMutation
  argument :attributes, Types::UserAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:, attributes:)
    user = UserPolicy.new(context[:current_user]).scope.find(id)

    if user.update(attributes.to_h)
      user
    else
      raise_error user.errors.full_messages.to_sentence
    end

    true
  end
end
