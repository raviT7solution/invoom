# frozen_string_literal: true

class Types::Session::SubjectEnum < Types::BaseEnum
  graphql_name "SessionSubjectEnum"

  Session.subjects.each_key { |i| value(i) }
end
