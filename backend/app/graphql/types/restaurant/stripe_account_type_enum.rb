# frozen_string_literal: true

class Types::Restaurant::StripeAccountTypeEnum < Types::BaseEnum
  graphql_name "RestaurantStripeAccountTypeEnum"

  Restaurant.stripe_account_types.each_key { |i| value(i, value: i) }
end
