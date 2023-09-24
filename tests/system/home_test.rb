# frozen_string_literal: true

require "application_system_test_case"

class HomeTest < ApplicationSystemTestCase
  test "hello world" do
    visit path_for(:frontend, "/")

    assert_selector "h1", text: "Hello World!"
  end
end
