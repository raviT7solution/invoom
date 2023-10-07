# frozen_string_literal: true

require "test_helper"

class User::SessionsTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user)
  end

  test "valid credentials" do
    query create_string, variables: { email: @user.email, password: @user.password }

    assert_query_success
    assert_equal @user, User::Session.find_by!(token: response.parsed_body["data"]["userSessionCreate"]["token"])
  end

  test "invalid credentials" do
    query create_string, variables: { email: @user.email, password: "wrong" }

    assert_query_error message: "Invalid password"
  end

  test "invalid user" do
    query create_string, variables: { email: "hacker", password: "wrong" }

    assert_query_error message: "User not found"
  end

  private

  def create_string
    <<~GQL
      mutation userSessionCreate($email: String!, $password: String!) {
        userSessionCreate(input: {email: $email, password: $password}) {
          token
        }
      }
    GQL
  end
end
