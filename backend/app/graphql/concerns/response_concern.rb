# frozen_string_literal: true

module ResponseConcern
  module ExceptionsHandler
    extend ActiveSupport::Concern

    included do
      rescue_from(ActiveRecord::RecordNotFound) { |e| raise GraphQL::ExecutionError, "#{e.model} not found" }
    end
  end

  module Helpers
    def raise_error(error)
      raise GraphQL::ExecutionError, error
    end
  end
end
