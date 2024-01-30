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

  class AuthorizedFieldExtension < GraphQL::Schema::FieldExtension
    def resolve(context:, object:, arguments:, **_rest)
      authorized = options.constantize.new(context[:current_user]).authorized_fields.include?(field.method_sym)

      raise GraphQL::ExecutionError, "Unauthorized" unless authorized

      yield object, arguments
    end
  end

  def initialize(*args, authorize: nil, authorize_field: nil, **kwargs, &block)
    extensions = (kwargs[:extensions] ||= [])

    extensions << { AuthorizationConcern::AuthorizeExtension => authorize } if authorize.present?
    extensions << { AuthorizationConcern::AuthorizedFieldExtension => authorize_field } if authorize_field.present?

    super(*args, **kwargs, &block)
  end
end
