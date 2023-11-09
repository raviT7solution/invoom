# frozen_string_literal: true

module AssertHelpers
  def assert_attributes(record, hash)
    hash.each do |k, v|
      assert_equal v, record.public_send(k)
    end
  end
end
