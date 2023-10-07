# frozen_string_literal: true

module AuthorizationConcern
  class AuthorizeExtension < GraphQL::Schema::FieldExtension
    def resolve(context:, object:, arguments:, **_rest)
      name, action = options.split("#")

      authorized = name.constantize.new(context[:current_user]).send(action)

      raise GraphQL::ExecutionError, "Unauthorized" unless authorized

      yield object, arguments
    end
  end

  class ScopeExtension < GraphQL::Schema::FieldExtension
    def resolve(context:, object:, arguments:, **_rest)
      scope = options.constantize.new(context[:current_user]).scope
      arguments = arguments.dup.merge(scope: scope).freeze

      yield object, arguments
    end
  end

  def initialize(*args, authorize: nil, authorized_scope: nil, **kwargs, &block)
    extensions = (kwargs[:extensions] ||= [])

    extensions << { AuthorizationConcern::AuthorizeExtension => authorize } if authorize.present?
    extensions << { AuthorizationConcern::ScopeExtension => authorized_scope } if authorized_scope.present?

    super(*args, **kwargs, &block)
  end
end
