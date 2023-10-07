# frozen_string_literal: true

module GraphqlRequestHelper
  def assert_query_error(message: nil)
    assert_response :success
    assert_not_empty response.parsed_body["errors"]

    assert_includes(response.parsed_body["errors"].pluck("message").to_sentence, message) if message
  end

  def assert_query_success
    assert_response :success
    assert_nil response.parsed_body["errors"]
  end

  def query(query_string, variables: nil)
    post graphql_path, params: { query: query_string, variables: variables }
  end
end
