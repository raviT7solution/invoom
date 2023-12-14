# frozen_string_literal: true

class FloorObject < ApplicationRecord
  enum :object_type, {
    table: 0,
    stage: 1,
    speaker: 2,
    buffet: 3,
    space: 4,
    object: 5
  }, prefix: :object_type

  belongs_to :restaurant

  validates :data, presence: true
  validates :name, presence: true
  validates :name, uniqueness: { scope: :restaurant_id }
  validates :object_type, presence: true
end
