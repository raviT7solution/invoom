# frozen_string_literal: true

module SessionsHelper
  def sign_in(user)
    hash = { state: { token: user.session.token }, version: 0 }

    visit path_for(:frontend, "/")
    page.execute_script "window.localStorage.setItem('session-store', arguments[0]);", hash.to_json
  end
end
