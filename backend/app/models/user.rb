# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password
  has_secure_password :pin, validations: false

  enum :gender, [:male, :female, :other]

  has_many :user_restaurants, dependent: :destroy
  has_many :user_roles, dependent: :destroy

  has_many :restaurants, through: :user_restaurants
  has_many :roles, through: :user_roles

  validates :email, presence: true, uniqueness: true
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :phone_number, presence: true
  validates :start_date, presence: true
  validates :username, presence: true, uniqueness: true
  validates :wage, presence: true

  def admin?
    false
  end

  def full_name
    "#{first_name} #{last_name}".strip
  end

  def session
    Session.new(self)
  end
end
