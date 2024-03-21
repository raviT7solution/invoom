# frozen_string_literal: true

class Types::CountryType < Types::BaseObject
  field :alpha2, String, null: false
  field :code, String, null: false
  field :name, String, null: false
  field :timezones, [Types::TimezoneType], null: false
end
