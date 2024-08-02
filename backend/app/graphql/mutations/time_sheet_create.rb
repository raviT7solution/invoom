# frozen_string_literal: true

class Mutations::TimeSheetCreate < Mutations::BaseMutation
  argument :attributes, Types::TimeSheetAttributes, required: true
  argument :user_id, ID, required: true

  type Boolean, null: false

  def resolve(attributes:, user_id:)
    user = UserPolicy.new(context[:current_user]).scope.find(user_id)
    time_sheet = user.time_sheets.new(attributes.to_h)

    raise_error time_sheet.errors.full_messages.to_sentence unless time_sheet.save

    true
  end
end
