# frozen_string_literal: true

class Mutations::UserDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Types::UserType, null: false

  def resolve(id:)
    user = UserPolicy.new(context[:current_user]).scope.find(id)

    if user.destroy
      user
    else
      raise_error user.errors.full_messages.to_sentence
    end
  end
end
