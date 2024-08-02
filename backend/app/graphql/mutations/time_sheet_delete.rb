# frozen_string_literal: true

class Mutations::TimeSheetDelete < Mutations::BaseMutation
  argument :id, ID, required: true

  type Boolean, null: false

  def resolve(id:)
    time_sheet = TimeSheetPolicy.new(context[:current_user]).scope.find(id)

    raise_error time_sheet.errors.full_messages.to_sentence unless time_sheet.destroy

    true
  end
end
