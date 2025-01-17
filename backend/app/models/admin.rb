# frozen_string_literal: true

class Admin < ApplicationRecord
  has_secure_password

  has_many :admin_restaurants, dependent: :destroy
  has_many :sessions, as: :sessionable, dependent: :destroy

  has_many :restaurants, through: :admin_restaurants

  validates :email, presence: true, uniqueness: true
  validates :first_name, presence: true
  validates :last_name, presence: true

  def full_name
    "#{first_name} #{last_name}".strip
  end
end
