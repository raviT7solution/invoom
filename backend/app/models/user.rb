# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  enum :gender, [:male, :female, :other]
  enum :employment_type, [:salary, :hourly]

  belongs_to :restaurant

  has_many :bookings, dependent: :restrict_with_error
  has_many :time_sheets, dependent: :destroy
  has_many :user_roles, dependent: :destroy

  has_many :roles, through: :user_roles

  validates :email, presence: true, uniqueness: true
  validates :employment_type, presence: true
  validates :first_name, presence: true
  validates :gender, presence: true
  validates :last_name, presence: true
  validates :max_hour, presence: true
  validates :phone_number, presence: true
  validates :pin, length: { is: 4 },
                  numericality: { only_integer: true },
                  presence: true,
                  uniqueness: { scope: :restaurant_id }
  validates :preferred_name, presence: true
  validates :start_date, presence: true
  validates :wage, presence: true

  def full_name
    "#{first_name} #{last_name}".strip
  end

  def permission?(permission)
    roles.map(&:permissions).flatten.include?(permission)
  end

  def permissions
    roles.flat_map(&:permissions).uniq
  end
end
