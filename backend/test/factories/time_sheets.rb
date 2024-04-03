# frozen_string_literal: true

FactoryBot.define do
  factory :time_sheet do
    end_time { nil }
    start_time { nil }

    user { nil }
  end
end
