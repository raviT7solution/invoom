# frozen_string_literal: true

class TimeSheet < ApplicationRecord
  belongs_to :user

  validates :start_time, presence: true
end
