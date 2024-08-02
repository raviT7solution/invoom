# frozen_string_literal: true

class Types::TimeSheetAttributes < Types::BaseInputObject
  argument :end_time, GraphQL::Types::ISO8601DateTime, required: false
  argument :start_time, GraphQL::Types::ISO8601DateTime, required: false
end
