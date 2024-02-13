# frozen_string_literal: true

FactoryBot.define do
  factory :modifier do
    global_modifier { false }
    multi_select { false }
    name { Faker::Food.ingredient }
    values { ["Low"] }
    visible { true }
  end
end
