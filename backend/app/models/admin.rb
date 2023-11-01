# frozen_string_literal: true

class Admin < ApplicationRecord
  has_secure_password

  validates :email, presence: true, uniqueness: true

  def admin?
    true
  end

  def session
    Session.new(self)
  end
end
