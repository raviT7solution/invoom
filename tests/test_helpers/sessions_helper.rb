# frozen_string_literal: true

module SessionsHelper
  def sign_in(user)
    hash = { state: { token: Session.token(user, "web_admin_id") }, version: 0 }

    visit path_for(:frontend, "/")
    page.execute_script "window.localStorage.setItem('session-store', arguments[0]);", hash.to_json
  end
end
