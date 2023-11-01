# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password
  has_secure_password :pin, validations: false

  enum :gender, [:male, :female]

  validates :email, presence: true, uniqueness: true
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :phone_number, presence: true
  validates :start_date, presence: true
  validates :username, presence: true, uniqueness: true
  validates :wage, presence: true

  def full_name
    "#{first_name} #{last_name}".strip
  end

  def session
    Session.new(self)
  end
end
