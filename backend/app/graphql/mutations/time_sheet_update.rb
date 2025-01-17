# frozen_string_literal: true

class Mutations::TimeSheetUpdate < Mutations::BaseMutation
  argument :attributes, Types::TimeSheetAttributes, required: true
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(attributes:, id:)
    time_sheet = TimeSheetPolicy.new(context[:current_session]).scope.find(id)

    raise_error time_sheet.errors.full_messages.to_sentence unless time_sheet.update(attributes.to_h)

    true
  end
end
