# frozen_string_literal: true

class Types::TimeSheetSummaryType < Types::BaseObject
  field :total_hours, Float, null: false

  def total_hours
    time_sheets = TimeSheet.arel_table
    total_hours_expression = (time_sheets[:end_time] - time_sheets[:start_time]) / 3600

    object.sum(total_hours_expression)
  end
end
