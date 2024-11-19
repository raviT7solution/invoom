# frozen_string_literal: true

class Types::RestaurantType < Types::BaseObject
  field :address, String, null: true
  field :city, String, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :phone_number, String, null: false
  field :postal_code, String, null: false
  field :province, String, null: false
  field :stripe_account_id, String, null: true
  field :stripe_account_type, Types::Restaurant::StripeAccountTypeEnum, null: true
  field :taxpayer_id, String, null: true
  field :timezone, String, null: false
  field :website, String, null: true
end
