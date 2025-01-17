# frozen_string_literal: true

class Mutations::AdminSessionCreate < Mutations::BaseMutation
  argument :email, String, required: true
  argument :password, String, required: true
  argument :subject, Types::Session::SubjectEnum, required: true

  field :token, String, null: false

  def resolve(email:, password:, subject:)
    admin = Admin.find_by!(email: email)

    raise_error "Invalid password" unless admin.authenticate(password)

    case subject
    when "kds_admin"
      { token: Session.kds_admin_token(admin) }
    when "mobile_admin"
      { token: Session.mobile_admin_token(admin) }
    when "web_admin"
      { token: Session.web_admin_token(admin) }
    end
  end
end
