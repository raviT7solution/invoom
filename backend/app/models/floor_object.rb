# frozen_string_literal: true

class FloorObject < ApplicationRecord
  DATA_VALID_KEYS = ["addons", "length", "rotate", "translateX", "translateY", "width"].sort.freeze

  enum :object_type, {
    table: 0,
    stage: 1,
    speaker: 2,
    buffet: 3,
    space: 4,
    custom: 5,
    bar: 6,
    kitchen: 7,
    pantry: 8,
    entrance: 9
  }, prefix: :object_type

  belongs_to :restaurant

  validate :validate_data
  validate :validate_table_data, if: :object_type_table?
  validates :data, presence: true
  validates :name, presence: true
  validates :name, uniqueness: { scope: :restaurant_id }
  validates :object_type, presence: true

  private

  def validate_data
    return if data.keys.sort == DATA_VALID_KEYS

    errors.add(:data)
  end

  def validate_table_data
    return if data["addons"].present? && (data["addons"].keys.sort == ["chairQuantity", "type"].sort)

    errors.add(:data)
  end
end
