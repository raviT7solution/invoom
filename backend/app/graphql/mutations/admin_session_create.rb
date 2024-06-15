# frozen_string_literal: true

class Mutations::AdminSessionCreate < Mutations::BaseMutation
  argument :email, String, required: true
  argument :password, String, required: true
  argument :subject, enum("AdminSessionCreateSubjectEnum", ["mobile", "kds", "web"]), required: true

  type Types::AdminSessionType, null: false

  def resolve(email:, password:, subject:)
    admin = Admin.find_by!(email: email)
    options = subject == "web" ? { exp: 1.day.after.to_i } : {}

    if admin.authenticate(password)
      { token: Session.token(admin, "#{subject}_admin_id", options) }
    else
      raise_error "Invalid password"
    end
  end
end
