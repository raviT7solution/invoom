# frozen_string_literal: true

class Mutations::UserSessionDestroy < Mutations::BaseMutation
  type Boolean, null: false

  def resolve
    time_sheet = context[:current_session].mobile_user!.time_sheets.find_by(end_time: nil)

    return true if time_sheet.blank?

    raise_error time_sheet.errors.full_messages.to_sentence unless time_sheet.update(end_time: DateTime.current)

    true
  end
end
