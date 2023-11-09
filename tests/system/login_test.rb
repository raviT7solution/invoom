# frozen_string_literal: true

require "application_system_test_case"

class LoginTest < ApplicationSystemTestCase
  test "valid credentials" do
    admin = create(:admin)

    visit path_for(:frontend, "/")

    assert_selector ".ant-card-head-title", text: "Login"

    fill_in "Email", with: admin.email
    fill_in "Password", with: admin.password

    click_on "Login"

    assert_selector ".ant-menu-title-content", text: "Dashboard"
  end

  test "non admin can't login" do
    user = create(:user)

    visit path_for(:frontend, "/")

    assert_selector ".ant-card-head-title", text: "Login"

    fill_in "Email", with: user.email
    fill_in "Password", with: user.password

    click_on "Login"

    assert_content "Admin not found"
  end

  test "invalid credentials" do
    admin = create(:admin)

    visit path_for(:frontend, "/")

    assert_selector ".ant-card-head-title", text: "Login"

    fill_in "Email", with: admin.email
    fill_in "Password", with: "wrong"

    click_on "Login"

    assert_content "Invalid password"
  end
end
