# frozen_string_literal: true

class KitchenProfile < ApplicationRecord
  belongs_to :restaurant

  has_many :kitchen_profile_categories, dependent: :destroy

  has_many :categories, through: :kitchen_profile_categories

  validates :columns, presence: true
  validates :name, presence: true
  validates :notify, inclusion: [true, false]
  validates :rows, presence: true
end
