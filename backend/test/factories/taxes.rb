# frozen_string_literal: true

FactoryBot.define do
  factory :tax do
    category { "meals" }
    country { Faker::Address.country_code }
    display_name { Faker::Lorem.word }
    gst { Faker::Number.decimal(l_digits: 2) }
    hst { Faker::Number.decimal(l_digits: 2) }
    province { Faker::Address.state_abbr }
    pst { Faker::Number.decimal(l_digits: 2) }
    qst { Faker::Number.decimal(l_digits: 2) }
    rst { Faker::Number.decimal(l_digits: 2) }
  end
end
