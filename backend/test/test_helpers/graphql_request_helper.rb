# frozen_string_literal: true

module GraphqlRequestHelper
  def assert_query_error(message = nil)
    assert_response :success
    assert_not_empty response.parsed_body["errors"]

    assert_includes(response.parsed_body["errors"].pluck("message").to_sentence, message) if message
  end

  def assert_query_success
    assert_response :success
    assert_nil response.parsed_body["errors"]
  end

  def authentic_query(token, query_string, variables: nil)
    post graphql_path,
         headers: { "Authorization" => "Bearer #{token}" },
         params: { query: query_string, variables: variables&.to_json }
  end

  def query(query_string, variables: nil)
    post graphql_path, params: { query: query_string, variables: variables&.to_json }
  end

  private

  def cfd_admin_token(admin)
    Session.cfd_admin_token(admin)
  end

  def kds_admin_token(admin)
    Session.kds_admin_token(admin)
  end

  def mobile_admin_token(admin, device = nil)
    Session.mobile_admin_token(admin, device)
  end

  def mobile_user_token(user, device)
    Session.mobile_user_token(user, device)
  end

  def web_admin_token(admin)
    Session.web_admin_token(admin)
  end
end
