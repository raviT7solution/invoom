# frozen_string_literal: true

class Types::TimeSheetType < Types::BaseObject
  field :end_time, GraphQL::Types::ISO8601DateTime, null: true
  field :id, ID, null: false
  field :start_time, GraphQL::Types::ISO8601DateTime, null: false
  field :user_id, ID, null: false

  field :user, Types::UserType, scope: "UserPolicy", preload: :user, null: false
end
