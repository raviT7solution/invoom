# frozen_string_literal: true

class Types::QueryType < Types::BaseObject
  field :test_field, String, null: false

  def test_field
    "Hello World!"
  end
end
