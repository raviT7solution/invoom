# frozen_string_literal: true

class Mutations::User::SessionCreate < Mutations::BaseMutation
  argument :email, String, required: true
  argument :password, String, required: true

  type Types::User::SessionType, null: false

  def resolve(email:, password:)
    user = User.find_by!(email: email)

    if user.authenticate(password)
      user.session
    else
      raise_error "Invalid password"
    end
  end
end
