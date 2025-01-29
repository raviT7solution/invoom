# frozen_string_literal: true

class Role < ApplicationRecord
  PERMISSIONS = [
    "apply_discount",
    "clock_in_clock_out",
    "delete_ticket_item",
    "edit_item",
    "floor_plan",
    "force_clock_out",
    "inventory",
    "orders",
    "payments",
    "reservations",
    "takeout"
  ].freeze

  belongs_to :restaurant

  has_many :user_roles, dependent: :restrict_with_error

  has_many :users, through: :user_roles

  validates :auto_clock_in, inclusion: [true, false]
  validates :name, presence: true, uniqueness: { scope: :restaurant_id }

  validate :permissions_inclusion

  private

  def permissions_inclusion
    errors.add(:permissions) if (permissions - PERMISSIONS).present?
  end
end
