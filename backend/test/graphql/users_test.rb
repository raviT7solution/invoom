# frozen_string_literal: true

require "test_helper"

class UsersTest < ActionDispatch::IntegrationTest
  test "returns valid current user on authorized request" do
    admin = create(:admin)
    restaurant = create(:restaurant)
    admin.restaurants = [restaurant]

    role = create(:role, permissions: ["clock_in_clock_out"], restaurant: restaurant)
    user = create(:user, roles: [role], restaurant: restaurant)

    authentic_query user, "mobile_user", current_user_string, variables: {}

    assert_query_success
    assert_equal \
      ({ "gender" => user.gender, "id" => user.id, "preferredName" => user.preferred_name }),
      response.parsed_body["data"]["currentUser"]
  end

  private

  def current_user_string
    <<~GQL
      query currentUser {
        currentUser {
          gender
          id
          preferredName
        }
      }
    GQL
  end
end
