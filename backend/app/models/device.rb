# frozen_string_literal: true

class Device < ApplicationRecord
  belongs_to :restaurant

  has_many :sessions, dependent: :destroy

  validates :fingerprint, presence: true, uniqueness: { scope: :restaurant_id }
  validates :name, presence: true
end
