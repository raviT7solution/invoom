# frozen_string_literal: true

class Mutations::Admin::SessionCreate < Mutations::BaseMutation
  argument :email, String, required: true
  argument :password, String, required: true
  argument :subject, enum("AdminSessionCreateSubjectEnum", [:mobile, :web]), required: true

  type Types::Admin::SessionType, null: false

  def resolve(email:, password:, subject:)
    admin = Admin.find_by!(email: email)

    if admin.authenticate(password)
      { token: Session.token(admin, "#{subject}_admin_id") }
    else
      raise_error "Invalid password"
    end
  end
end
