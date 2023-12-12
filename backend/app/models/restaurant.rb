# frozen_string_literal: true

class Restaurant < ApplicationRecord
  has_many :floor_objects, dependent: :destroy
  has_many :roles, dependent: :destroy

  validates :name, presence: true
end
