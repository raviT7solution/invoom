# frozen_string_literal: true

class Types::UserType < Types::BaseObject
  field :address, String, null: true
  field :city, String, null: true
  field :email, String, null: false
  field :end_date, String, null: true
  field :first_name, String, null: false
  field :full_name, String, null: false
  field :gender, String, null: true
  field :id, ID, null: false
  field :last_name, String, null: false
  field :phone_number, String, null: false
  field :start_date, GraphQL::Types::ISO8601Date, null: false
  field :username, String, null: false
  field :wage, Float, null: false
  field :zip_code, String, null: true

  field :role_ids, [ID], null: false
end
