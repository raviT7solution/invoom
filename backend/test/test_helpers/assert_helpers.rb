# frozen_string_literal: true

module AssertHelpers
  def assert_attributes(record, hash)
    hash.each do |k, v|
      if v.nil?
        assert_nil record.public_send(k)
      else
        assert_equal v, record.public_send(k)
      end
    end
  end
end
