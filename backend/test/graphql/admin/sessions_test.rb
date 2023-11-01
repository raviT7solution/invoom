# frozen_string_literal: true

require "test_helper"

class Admin::SessionsTest < ActionDispatch::IntegrationTest
  setup do
    @admin = create(:admin)
  end

  test "valid credentials" do
    query create_string, variables: { email: @admin.email, password: @admin.password }

    assert_query_success
    assert_equal @admin, Session.find_by(token: response.parsed_body["data"]["adminSessionCreate"]["token"])
  end

  test "invalid credentials" do
    query create_string, variables: { email: @admin.email, password: "wrong" }

    assert_query_error message: "Invalid password"
  end

  test "invalid admin" do
    query create_string, variables: { email: "hacker", password: "wrong" }

    assert_query_error message: "Admin not found"
  end

  private

  def create_string
    <<~GQL
      mutation adminSessionCreate($email: String!, $password: String!) {
        adminSessionCreate(input: {email: $email, password: $password}) {
          token
        }
      }
    GQL
  end
end
