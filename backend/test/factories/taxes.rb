# frozen_string_literal: true

FactoryBot.define do
  factory :tax do
    category { "meals" }
    country { Faker::Address.country_code }
    cst { Faker::Number.decimal(l_digits: 2) }
    display_name { Faker::Lorem.word }
    gst { Faker::Number.decimal(l_digits: 2) }
    hst { Faker::Number.decimal(l_digits: 2) }
    postal_code { nil }
    province { Faker::Address.state_abbr }
    pst { Faker::Number.decimal(l_digits: 2) }
    qst { Faker::Number.decimal(l_digits: 2) }
    rst { Faker::Number.decimal(l_digits: 2) }
  end
end
