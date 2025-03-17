# frozen_string_literal: true

class Types::RestaurantType < Types::BaseObject
  field :address, String, null: true
  field :break_end_time, GraphQL::Types::ISO8601DateTime, null: true
  field :break_start_time, GraphQL::Types::ISO8601DateTime, null: true
  field :business_end_time, GraphQL::Types::ISO8601DateTime, null: true
  field :business_start_time, GraphQL::Types::ISO8601DateTime, null: true
  field :city, String, null: false
  field :country, String, null: false
  field :email, String, null: false
  field :id, ID, null: false
  field :name, String, null: false
  field :operational_since, String, null: false
  field :phone_number, String, null: false
  field :postal_code, String, null: false
  field :province, String, null: false
  field :restaurant_type, String, null: false
  field :stripe_account_id, String, null: true
  field :stripe_account_type, Types::Restaurant::StripeAccountTypeEnum, null: true
  field :taxpayer_id, String, null: true
  field :timezone, String, null: false
  field :twilio_account_sid, String, null: true, authorize: "ApplicationPolicy#web_admin?"
  field :twilio_auth_token, String, null: true, authorize: "ApplicationPolicy#web_admin?"
  field :twilio_sms_phone_number, String, null: true, authorize: "ApplicationPolicy#web_admin?"
  field :website, String, null: true
end
