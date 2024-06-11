# frozen_string_literal: true

class Mutations::Admin::ChangePassword < Mutations::BaseMutation
  argument :current_password, String, required: true
  argument :password, String, required: true

  type Boolean, null: false

  def resolve(current_password:, password:)
    admin = context[:current_user].web_admin!

    raise_error "Invalid current password" unless admin.authenticate(current_password)
    raise_error admin.errors.full_messages.to_sentence unless admin.update(password: password)

    true
  end
end
