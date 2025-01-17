# frozen_string_literal: true

FactoryBot.define do
  factory :session do
    subject { nil }

    device { nil }
    sessionable { nil }
  end
end
