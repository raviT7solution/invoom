# frozen_string_literal: true

class Types::TimezoneType < Types::BaseObject
  field :humanize_offset, String, null: false
  field :identifier, String, null: false
  field :offset, Integer, null: false
end
