# frozen_string_literal: true

require "application_system_test_case"

class DashboardTest < ApplicationSystemTestCase
  test "root page" do
    admin = create(:admin)
    sign_in(admin)

    visit path_for(:frontend, "/")

    assert_selector ".ant-menu-title-content", text: "Dashboard"
  end
end
