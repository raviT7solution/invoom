# frozen_string_literal: true

class Role < ApplicationRecord
  PERMISSIONS = [
    "clock_in_clock_out",
    "dashboard",
    "counter"
  ].freeze

  belongs_to :restaurant

  has_many :user_roles, dependent: :restrict_with_error

  has_many :users, through: :user_roles

  validates :name, presence: true, uniqueness: { scope: :restaurant_id }

  validate :permissions_inclusion

  private

  def permissions_inclusion
    errors.add(:permissions) if (permissions - PERMISSIONS).present?
  end
end
