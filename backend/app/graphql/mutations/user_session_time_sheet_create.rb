# frozen_string_literal: true

class Mutations::UserSessionTimeSheetCreate < Mutations::BaseMutation
  type Boolean, null: false

  def resolve
    user = context[:current_session].mobile_user!

    raise_error "User is already clocked-in" if user.already_clocked_in?

    time_sheet = user.time_sheets.new(start_time: Time.current)

    raise_error time_sheet.errors.full_messages.to_sentence unless time_sheet.save

    true
  end
end
