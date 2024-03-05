# frozen_string_literal: true

class Restaurant < ApplicationRecord
  has_many :addons, dependent: :destroy
  has_many :categories, dependent: :destroy
  has_many :floor_objects, dependent: :destroy
  has_many :items, dependent: :destroy
  has_many :menus, dependent: :destroy
  has_many :modifiers, dependent: :destroy
  has_many :roles, dependent: :destroy
  has_many :users, dependent: :destroy

  validates :name, presence: true
end
