# frozen_string_literal: true

class Menu < ApplicationRecord
  belongs_to :restaurant

  has_many :menu_categories, dependent: :restrict_with_error

  has_many :categories, through: :menu_categories

  validates :name, presence: true, uniqueness: { scope: :restaurant_id }
  validates :description, presence: true, if: proc { description.nil? }
end
