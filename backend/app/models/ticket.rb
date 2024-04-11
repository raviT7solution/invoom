# frozen_string_literal: true

class Ticket < ApplicationRecord
  belongs_to :booking

  has_many :ticket_items, dependent: :restrict_with_error
end
