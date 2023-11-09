# frozen_string_literal: true

class Mutations::UserCreate < Mutations::BaseMutation
  argument :attributes, Types::UserAttributes, required: true

  type Types::UserType, null: false

  def resolve(attributes:)
    user = User.new(attributes.to_h)

    if user.save
      user
    else
      raise_error user.errors.full_messages.to_sentence
    end
  end
end
